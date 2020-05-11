Unit Tests-(vpn connected)
    cd notificationsvc
    normal- go test ./...
    verbose- go test -v ./...
Integration Tests-(vpn connected)
    bash run_development
    cd testintegration
    npx mocha --timeout=0
Concurrency Tests-(vpn connected)
    cd notificationsvc
    bash run_development
    modify sockets variable to number of sockets to connect say 10
    run testintegration/socket.js 
        node socket -l(full log)
        node socket -l -r(random log)
        node socket(no log)
    start jmeter
    open concurrency jmx file in jmeter 
    set user defined variable scale to 1000, and hit enter
    observe notification are coming