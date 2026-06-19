import { useEffect, useState } from 'react';
import { useUrlEnvironmentConverter } from '../hooks/useUrlEnvironmentConverter';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-600">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-400';

type TDemoMode = 'toLocalhost' | 'toRemote';

function Page() {
  const { toLocalhost, toRemote, result, error } = useUrlEnvironmentConverter();
  const [mode, setMode] = useState<TDemoMode>('toLocalhost');

  const [url, setUrl] = useState(
    'https://abc.com/motor/quotes?enquire=13&token=sses',
  );
  const [base, setBase] = useState('motor');
  const [port, setPort] = useState('5173');
  const [domain, setDomain] = useState('abc.com');
  const [basePathIncluded, setBasePathIncluded] = useState(true);
  const [secondBasePath, setSecondBasePath] = useState('flw');

  useEffect(() => {
    if (mode === 'toLocalhost') {
      setUrl('https://abc.com/motor/quotes?enquire=13&token=sses');
    } else {
      setUrl('http://localhost:5173/motor/quotes?enquire=13&token=sses');
    }
  }, [mode]);

  const handleConvert = () => {
    if (mode === 'toLocalhost') {
      toLocalhost({ url, port, base, basePathIncluded, secondBasePath });
    } else {
      toRemote({ url, domain, base, basePathIncluded, secondBasePath });
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('toLocalhost')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
            mode === 'toLocalhost'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          https → localhost
        </button>
        <button
          type="button"
          onClick={() => setMode('toRemote')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
            mode === 'toRemote'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          localhost → https
        </button>
      </div>

      <Field
        label={
          mode === 'toLocalhost'
            ? 'Source URL (https)'
            : 'Source URL (localhost)'
        }
      >
        <input
          className={inputClass}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Base (expected, optional)">
          <input
            className={inputClass}
            value={base}
            onChange={(e) => setBase(e.target.value)}
          />
        </Field>

        {mode === 'toLocalhost' ? (
          <Field label="Port (required)">
            <input
              className={inputClass}
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </Field>
        ) : (
          <Field label="Domain (required, no protocol)">
            <input
              className={inputClass}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </Field>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={basePathIncluded}
            onChange={(e) => setBasePathIncluded(e.target.checked)}
          />
          Base path included
        </label>
        {!basePathIncluded && (
          <input
            className={`${inputClass} flex-1`}
            placeholder="2nd base path"
            value={secondBasePath}
            onChange={(e) => setSecondBasePath(e.target.value)}
          />
        )}
      </div>

      <button
        type="button"
        onClick={handleConvert}
        className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
      >
        Convert
      </button>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error.message}
        </p>
      )}

      {result && (
        <div className="space-y-2 rounded-md bg-slate-50 p-3 text-sm">
          <div>
            <span className="font-medium text-slate-700">Output URL: </span>
            <span className="break-all text-slate-900">{result.url}</span>
          </div>
          <div>
            <span className="font-medium text-slate-700">Base path: </span>
            {result.basePath || '(none)'}
          </div>
          <div>
            <span className="font-medium text-slate-700">Path params: </span>
            {JSON.stringify(result.pathParams)}
          </div>
          <div>
            <span className="font-medium text-slate-700">Query params: </span>
            {JSON.stringify(result.queryParams)}
          </div>
          {result.warning && (
            <div className="text-amber-700">{result.warning}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
