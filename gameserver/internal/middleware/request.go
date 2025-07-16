package middleware

import (
	"log/slog"
	"net/http"
	"time"
)

func LogRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		next.ServeHTTP(w, r)

		slog.InfoContext(r.Context(), "HTTP request",
			slog.String("method", r.Method),
			slog.String("path", r.URL.Path),
			//slog.Int("status", w.statusCode),
			slog.Duration("duration", time.Since(start)),
			slog.String("ip", r.RemoteAddr),
			slog.String("user_agent", r.UserAgent()),
		)
	})
}
