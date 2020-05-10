Unit Tests-(vpn connected)
    normal- go test ./...
    verbose- go test -v ./...
Integration Tests-(vpn connected)
    bash run_development
    cd testintegration
    npx mocha --timeout 1000000
