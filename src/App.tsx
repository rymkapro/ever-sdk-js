import { useEffect, useState } from 'react';
import './App.css';
import { TonClient } from '@eversdk/core';
import { Buffer } from 'buffer';

const client = new TonClient();

function App() {
    const [version, setVersion] = useState<string>();
    const [phrases, setPhrases] = useState<string[]>([]);
    const [zstd, setZstd] = useState<string[][]>([]);

    const generatePhrases = async () => {
        const _phrases = await Promise.all(
            new Array(500).fill(0).map(async () => {
                const _phrase = await client.crypto.mnemonic_from_random({});
                return _phrase.phrase;
            })
        );
        setPhrases(_phrases);
        setZstd([]);
    };

    const warmZstdParallel = async () => {
        setZstd([['Working...']]);
        const _zstd = await Promise.all(
            phrases.map(async (phrase) => {
                const compressed = await client.utils.compress_zstd({
                    uncompressed: Buffer.from(phrase).toString('base64'),
                });
                const decompressed = await client.utils.decompress_zstd({
                    compressed: compressed.compressed,
                });

                return [
                    compressed.compressed,
                    Buffer.from(decompressed.decompressed, 'base64').toString(),
                ];
            })
        );
        setZstd(_zstd);
    };

    const warmZstdSequence = async () => {
        setZstd([['Working...']]);
        const _zstd = [];
        for (const phrase of phrases) {
            const compressed = await client.utils.compress_zstd({
                uncompressed: Buffer.from(phrase).toString('base64'),
            });
            const decompressed = await client.utils.decompress_zstd({
                compressed: compressed.compressed,
            });

            _zstd.push([
                compressed.compressed,
                Buffer.from(decompressed.decompressed, 'base64').toString(),
            ]);
        }

        setZstd(_zstd);
    };

    useEffect(() => {
        client.client.version().then((r) => setVersion(r.version));
    }, [client]);

    return (
        <div className="App">
            <h3>Version {version}</h3>
            <div>
                <h3>Phrases</h3>
                <div>
                    <textarea
                        cols={80}
                        rows={10}
                        readOnly
                        value={phrases.map((phrase) => phrase).join('\n')}
                    ></textarea>
                </div>
                <button onClick={generatePhrases}>Generate phrases</button>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h3>Warm zstd</h3>
                <div>
                    <textarea
                        cols={80}
                        rows={10}
                        readOnly
                        value={zstd.map((pair) => pair.join('\n')).join('\n')}
                    ></textarea>
                </div>
                <button
                    onClick={warmZstdSequence}
                    disabled={!phrases.length}
                    style={{ marginRight: '10px' }}
                >
                    Warm zstd (sequence)
                </button>
                <button onClick={warmZstdParallel} disabled={!phrases.length}>
                    Warm zstd (parallel)
                </button>
            </div>
        </div>
    );
}

export default App;
