'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              Something went wrong
            </div>
            <div style={{ padding: '24px' }}>
              <p
                style={{
                  margin: '0 0 16px',
                  fontSize: '14px',
                  color: '#374151',
                  fontFamily: 'monospace',
                  backgroundColor: '#f3f4f6',
                  padding: '12px',
                  borderRadius: '8px',
                  wordBreak: 'break-word',
                }}
              >
                {error.message}
              </p>
              <button
                onClick={reset}
                style={{
                  width: '100%',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#ffffff',
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
