package moduleversion

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
	"path/filepath"

	"ui-platform-servers/notificationsvc/utils"
)

var MODULE_VERSION_KEY string = "-runtime-module-version"
var DEFAULT_VERSION uint8 = 101
var moduleDomainMap ModuleDomainMap

type ModuleDomainMap struct {
	EntityData        []string `json:"entityData"`
	EntityModel       []string `json:"entityModel"`
	EntityGovernData  []string `json:"entityGovernData"`
	Config            []string `json:"config"`
	EventData         []string `json:"eventData"`
	GenericObjectData []string `json:"genericObjectData"`
}

func GetVersionKey(module string, domain string, tenantId string) (string, error) {
	var resolvedDomain string
	var err error
	if domain == "" {
		resolvedDomain = "default"
	} else {
		resolvedDomain, err = GetResolvedDomain(module, domain)
		if err != nil {
			return "", errors.New("UpdateModuleVersion- cannot resolve domain")
		}
	}
	versionKey := module + "-" + resolvedDomain + "-" + tenantId + MODULE_VERSION_KEY
	return versionKey, nil
}

func GetResolvedDomain(module string, domain string) (string, error) {
	if module == "" {
		return "", errors.New("GetVersion- no module provided")
	}
	var domainIter []string
	var resolvedDomain string
	switch module {
	case "entityData":
		domainIter = moduleDomainMap.EntityData
		break
	case "entityModel":
		domainIter = moduleDomainMap.EntityModel
	case "entityGovernData":
		domainIter = moduleDomainMap.EntityGovernData
	case "config":
		domainIter = moduleDomainMap.Config
	case "eventData":
		domainIter = moduleDomainMap.EventData
	case "genericObject":
		domainIter = moduleDomainMap.GenericObjectData
	}

	for _, _domain := range domainIter {
		if _domain == domain {
			resolvedDomain = domain
			break
		} else {
			resolvedDomain = "default"
		}
	}
	return resolvedDomain, nil
}

func LoadDomainMap() error {
	var basedir string
	if os.Getenv("ENV") != "" {
		basedir = "./moduleversion/"
	}
	abspath, err := filepath.Abs(basedir + "moduledomainmap.json")
	if err == nil {
		mapFile, err := os.Open(abspath)
		defer mapFile.Close()
		byteValue, _ := ioutil.ReadAll(mapFile)
		if err != nil {
			utils.PrintError(err.Error())
		}
		_ = json.Unmarshal([]byte(byteValue), &moduleDomainMap)
	} else {
		return err
	}
	return nil
}

func GetModuleDomainMap() ModuleDomainMap {
	return moduleDomainMap
}
