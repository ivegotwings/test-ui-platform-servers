package state

import (
	"testing"

	"github.com/garyburd/redigo/redis"
)

func TestSTATE(t *testing.T) {
	err := Connect(nil)
	if err != nil {
		t.Errorf("state failed to connect to %v", err)
	}
	conn.Send("SET", "TESTKEY", 1)
	conn.Flush()
	version, err := redis.Int(conn.Do("GET", "TESTKEY"))
	if err == nil {
		var newversion uint8
		if version != 0 {
			_version := uint8(version)
			newversion = _version + 1
		}
		conn.Send("SET", "TESTKEY", newversion)
		conn.Flush()
	} else {
		t.Errorf("state failed to update test key %v", err)
	}

	finalversion, err := redis.Int(conn.Do("GET", "TESTKEY"))
	if finalversion != 2 {
		t.Errorf("state failed to update test key %v", err)
	}

}
