Unit Tests-(vpn connected)
    cd notificationsvc
    normal- go test ./...
    verbose- go test -v ./...
Integration Tests-(vpn connected)
    bash run_development
    cd testintegration
    npx mocha --timeout 1000000
Concurrency Tests-(vpn connected)
    cd notificationsvc
    bash run_development
    start jmeter
    open concurrency jmx file in jmeter 
    set user defined variable scale to 1000, and hit enter
    run testdata/socket.js and connect atleast 10 sockets
    observe notification are coming