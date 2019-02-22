const baseUrl = "https://demo.rhapi.net/demo01";

// Instanciation d'un client sans authentification
var Client = require("rhapi-client").Client;
var client = new Client(baseUrl);

class ClientRhapi {
    constructor () {
        this.CONVENTION_PS_SECTORS_DATE = "2015-01-01";
        this.serverDataKeywords = new Array();
        this.serverDataContext = null;
    }
    
    CONVENTION_PS_SECTORS_DATE_Get() {
        return this.CONVENTION_PS_SECTORS_DATE;
    }
    
    serverDataKeywordsGet() {
        return this.serverDataKeywords;
    }
    
    serverDataKeywordsGet2(callback) {
        callback(this.serverDataKeywords);
    }
    
    serverDataContextGet() {
        return this.serverDataContext;
    }
    
    serverDataKeywordsSet(valNew) {
        this.serverDataKeywords = valNew;
    }
    
    serverDataContextSet(valNew) {
        this.serverDataContext = valNew;
    }

    loadContext(controller, callback) {
        // callback : fonction qui sera exécutée lors de l'appel à loadContext (traitement du résultat)
        client.CCAM.contextes(
            function (result) {
                //console.log(result);
                callback(controller, result);
            },
            function (error) {
                console.log(error);
            }
        )
    }

    loadActes(controller, texte, htmlResultsReset, callback) {
        var options = {
            texte: texte  
        };
        client.CCAM.readAll(
            options,
            function(result) {
                //console.log(result);
                callback(controller, baseUrl, result, htmlResultsReset);
            },
            function(error) {
                console.log(error);
            }
        );
    }

    loadMoreActes(controller, texte, offset, htmlResultsReset, callback) {
        var options = {
            texte: texte,
            offset: offset  
        };
        client.CCAM.readAll(
            options,
            function(result) {
                //console.log(result);
                callback(controller, baseUrl, result, htmlResultsReset);
            },
            function(error) {
                console.log(error);
            }
        );
    }

    loadActeWithCode(controller, code, htmlResultsReset, callback) {
        client.CCAM.read(
            code,
            {},
            function(result) {
                //console.log(result);
                callback(controller, result, htmlResultsReset);
            },
            function(error) {
                console.log(error);
            }
        );
    }
    
    loadTarif(controller, code, medicalActActiviteCode, medicalActPhaseCode, medicalActGridCode, medicalActDomCode, medicalActModificatorCode, /*htmlResultsReset,*/ callback) {
        var params = {
            grille: medicalActGridCode,
            activite: medicalActActiviteCode,
            phase: medicalActPhaseCode,
            dom: medicalActDomCode,
            modificateurs: medicalActModificatorCode
        }
        client.CCAM.tarif(
            code,
            params,
            function (result) {
                //console.log(result);
                callback(controller, result)
            },
            function (error) {
                console.log(error);
            }
        )
    }
}