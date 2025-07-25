package response

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

func SendJSONResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	//json.Decoder()
	res, err := json.Marshal(data)
	if err != nil {
		//http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
		slog.Error("Error encoding JSON", err)
		return
	}
	w.Write(res)
}
