class Controller {
	constructor () {
		this.controller = this;
		this.clientRhapi = new ClientRhapi();
		this.viewSearchCcam = new ViewSearchCCAM();
		this.viewMedicalAct = new ViewMedicalAct();
		this.viewMenu = new ViewMenu();
		this.medicalActs = new Array();
		this.browserUri = new BrowserUri();
	}
	
	// [1/2] Récupération de l'objet "contextes".
	controlContext () {
		var serverUrls = this.clientRhapi.serverDataUrlPrepare(null, null, null, null);
		this.clientRhapi.serverDataGet(this.controller, serverUrls["urlStart"], serverUrls["urlContext"], false, this.controller.contextResults);
	}
	
	// [2/2] Récupération de l'objet "contextes".
	contextResults(controller, urlStart, urlComplete, datas, htmlResultsReset) {
		controller.clientRhapi.serverDataContextSet(datas);
		controller.viewMenu.versionUpdate("Ver. " + datas.version);
		controller.control();
	}
	
	// Une fois l'objet "contextes" récupéré, appel de la méthode de contrôle qui contient les principaux événements de l'application.
	control () {
		var undefined = 2;
		var controller = this.controller;
		var clientRhapi = this.clientRhapi;
		var viewSearchCcam = this.viewSearchCcam;
		var viewMedicalAct = this.viewMedicalAct;
		var browserUri = this.browserUri;
		
		// ####################
		// Page "Recherche"
		// ####################
		
		// Le clique du logo ramène à la page de recherche.
		$("#menu-logo").click(function() {
			viewMedicalAct.pauseOn();
			viewMedicalAct.modificatorOptionsReset();
			viewMedicalAct.modificatorShow(false);
			viewSearchCcam.resumeOn(viewMedicalAct.backResultAnchorGet());
		});
		
		var dateInputDefault = new Date();
		var dateInputDefaultDay = dateInputDefault.getDate() + "";
		var dateInputDefaultMonth = dateInputDefault.getMonth() + 1 + "";
		dateInputDefaultDay = (dateInputDefaultDay.length == 1)?"0" + dateInputDefaultDay:dateInputDefaultDay;
		dateInputDefaultMonth = (dateInputDefaultMonth.length == 1)?"0" + dateInputDefaultMonth:dateInputDefaultMonth;
		var dateInputDefaultDisplay = dateInputDefaultDay + "/" + dateInputDefaultMonth + "/" + dateInputDefault.getFullYear();
		viewSearchCcam.dateSearchSet(dateInputDefaultDisplay);
		
		var inputVal, inputValLength = 0;
		var urlStart, urlKeyword;
		
		// Champ de date de la page de recherche d'un acte.
		$("#input-search-date").datepicker({
			altField: "#input-search-date",
			closeText: 'Fermer',
			prevText: 'Précédent',
			nextText: 'Suivant',
			currentText: 'Aujourd\'hui',
			monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
			monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
			dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
			dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
			dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
			weekHeader: 'Sem.',
			dateFormat: 'dd/mm/yy'
		});
		
		// Quand une touche du clavier est tapée dans le champ de recherche
		$("#input-search").keydown(function(keyPressed) {
			// setTimeout qui sert à attendre que le caractère qui vient d'être tapé au clavier soit bien pris en compte
			setTimeout(function () {
				
				if (viewSearchCcam.inputSearchKeywordLengthGet() < 3) {
					controller.viewSearchCcam.autocompleteBoxHide();
				}
				
				viewSearchCcam.inputDeleteReady(true);
				if (viewSearchCcam.inputSearchKeywordLengthGet() == 0) {
					viewSearchCcam.inputDeleteReady(false);
				}
				
				inputVal = viewSearchCcam.inputSearchKeywordGet();
				if (inputVal != controller.viewSearchCcam.searchLastGet()) {
					controller.viewSearchCcamF(controller);
				}
				
				viewSearchCcam.searchNextSet(viewSearchCcam.inputSearchKeywordGet());
				
				inputVal = viewSearchCcam.inputSearchKeywordGet();
				var dataUrl = clientRhapi.serverDataUrlPrepare(inputVal, null, null, null, null);
				inputVal = dataUrl["inputVal"];
				inputValLength = dataUrl["inputValLength"];
				urlStart = dataUrl["urlStart"];
				urlKeyword = dataUrl["urlKeyword"];
			}, 50);
		});
		
		// [1/3] Autocomplétion lors de la frappe dans le champ de recherche d'un acte.
		$("#input-search").autocomplete({
			source: function (request, reply){
				if (viewSearchCcam.inputSearchKeywordLengthGet() >= 3) {
					viewSearchCcam.inputSearchAutocompleteReplySet(reply);
					controller.autocomplete(controller);
				}
				
				// Masquage des suggestions de la dernière recherche.
				controller.viewSearchCcam.autocompleteBoxHide();
			}
		});
		
		// Clique d'un élément du menu des suggestions proposées par l'autocomplétion.
		$(".ui-autocomplete").click(function () {
			inputVal = viewSearchCcam.inputSearchKeywordGet();
			viewSearchCcam.searchNextSet(viewSearchCcam.inputSearchKeywordGet());
			if (inputVal != controller.viewSearchCcam.searchCurrentGet() && inputVal != controller.viewSearchCcam.searchLastGet()) {
				controller.viewSearchCcamF(controller);
			}
		});
		
		$("#input-search-remove").click(function () {
			$("#input-search").val("");
			controller.viewSearchCcam.inputSearchReady(false);
			controller.viewSearchCcam.inputDeleteReady(false);
			$("#input-search").focus();
		});
		
		// Bouton qui affiche plus de résultats.
		$("#result-button-more").click(function() {
			if (viewSearchCcam.resultsButtonMoreActiveGet() == false) {
				viewSearchCcam.resultsButtonMoreActiveSet(true);
				viewSearchCcam.resultsMoreLoading();
				urlStart = viewSearchCcam.resultsElementsUrlStartGet();
				var urlMoreElement = viewSearchCcam.resultsElementsUrlPageNextGet();
				var htmlResultsReset = false;
				clientRhapi.serverDataGet(controller, urlStart, urlMoreElement, htmlResultsReset, controller.searchResults)
			}
		});
		
		// Remise à zero du champ de recherche quand l'application se relance (bouton rafraîchir la page du navigateur web).
		viewSearchCcam.inputSearchKeywordReset();
		
		// =====
		// Valeur paramètres "GET" entrés depuis l'url.
		// Si "texte", sa valeur est copiée dans le champ de recherche et une recherche est lancée.
		// Commentez ce code pour ne pas mettre en place cette fonctionnalité.
		// =====
		// Récupération d'un mot-clé depuis l'uri
		var $_GET = browserUri.paramsGet();
		if (typeof $_GET["texte"] != "undefined") {
			// Si un mot-clé existe : recherche à l'aide de mot-clé.
			viewSearchCcam.inputSearchKeywordSet($_GET["texte"]);
			controller.viewSearchCcamF(controller);
		}
		
		// ####################
		// Page "Acte médical"
		// ####################
		
		$("#medical-act-back").click(function() {
			viewMedicalAct.pauseOn();
			viewMedicalAct.modificatorOptionsReset();
			viewMedicalAct.modificatorShow(false);
			viewSearchCcam.resumeOn(viewMedicalAct.backResultAnchorGet());
		});
		
		$("#medical-act-conventions-ps").change(function() {
			controller.viewMedicalActUpdate(controller);
		});
		$("#medical-act-dom").change(function() {
			controller.viewMedicalActUpdate(controller);
		});
		
		$("#medical-act-modificators-select-area").click(function() {
			controller.viewMedicalAct.modificatorShow(true);
		});
		
		$("#medical-act-modificator-reset").click(function() {
			if (viewMedicalAct.modificatorOptionsReset()) {
				controller.viewMedicalActUpdate(controller);
			}
		});
	}
	
	// [2/3] Autocomplétion lors de la frappe dans le champ de recherche d'un acte.
	autocomplete (controller) {
		var reply = controller.viewSearchCcam.inputSearchAutocompleteReplyGet();
		controller.clientRhapi.serverDataKeywordsGet2(function (datas) {
			controller.autocomplete2(controller, reply, datas);
		});
	}
	
	// [3/3] Autocomplétion lors de la frappe dans le champ de recherche d'un acte.
	autocomplete2 (controller, reply, datas) {
		if (controller.viewSearchCcam.inputSearchKeywordLengthGet() >= 3) {
			reply($.map(datas.slice(0, 4), function(object){
				return object;
			}));
		}
	}
	
	// [1/3] La recherche d'un acte par mot-clé est lancée.
	viewSearchCcamF (controller) {
		controller.viewSearchCcam.searchLastSet(controller.viewSearchCcam.inputSearchKeywordGet());
		if (controller.viewSearchCcam.inputSearchKeywordLengthGet() >= 3) {
			controller.viewSearchCcamF2(controller);
		} else {
			controller.viewSearchCcam.inputSearchReady(false);
		}
	}
	
	// [2/3] La recherche d'un acte par mot-clé est lancée.
	viewSearchCcamF2 (controller) {
		if (controller.viewSearchCcam.searchCurrentGet() === "") {
			controller.viewSearchCcam.searchCurrentSet(controller.viewSearchCcam.searchNextGet());
			controller.viewSearchCcam.searchNextSet("");
		} else {
			return;
		}
		controller.viewSearchCcam.resultsContentLoading();
		controller.viewSearchCcam.inputSearchReady(true);
		var inputVal = controller.viewSearchCcam.inputSearchKeywordGet();
		var htmlResultsReset = true;
		var dataUrl = controller.clientRhapi.serverDataUrlPrepare(inputVal, null, null, null, null);
		controller.clientRhapi.serverDataGet(controller, dataUrl["urlStart"], dataUrl["urlKeyword"], htmlResultsReset, controller.searchResults);
	}
	
	// [3/3] La recherche d'un acte par mot-clé est lancée.
	searchResults (controller, urlStart, urlComplete, datas, htmlResultsReset) {
		var informations = datas.informations;
		var codes = datas.results;
		var linksNext = null;
		
		controller.clientRhapi.serverDataKeywordsSet(datas.keywords);
		
		// Relancer immédiatement l'auto-complétion si autocomplete() a déjà eu lieue au moins une fois.
		if (controller.viewSearchCcam.inputSearchAutocompleteReplyGet() != null) {
			controller.autocomplete(controller);
		}
		
		if (controller.viewSearchCcam.searchNextGet() != "" && controller.viewSearchCcam.searchNextGet() != controller.viewSearchCcam.searchCurrentGet()) {
			controller.clientRhapi.serverDataKeywordsSet(new Array());
			controller.viewSearchCcam.searchCurrentSet("");
			// Relance de la recherche d'un acte à partir de la méthode "viewSearchCcamF2".
			controller.viewSearchCcamF2(controller);
		} 
		else {
			// La requête vers la BDD est terminée et le contenu du champ de recherche n'a pas changé depuis que la requête vers la BDD a commencée, donc la recherche est terminée.
			controller.viewSearchCcam.resultsButtonMoreActiveSet(false);
			controller.viewSearchCcam.searchKeywordsReset();
			if (controller.viewSearchCcam.inputSearchKeywordLengthGet() >= 3) {
				// La page de recherche a fini de charger.
				controller.viewSearchCcam.resultsContentLoaded(htmlResultsReset);
				controller.viewSearchCcam.resultsMoreLoaded();
				controller.viewSearchCcam.resumeOn(null);
				
				// Création de la liste des résultats de recherche.
				controller.viewSearchCcam.tableCreateTitles(informations);
				var f = controller.viewSearchCcam.resultsElementsIndexGet();
				codes.forEach(function(code) {
					if (typeof controller.medicalActs[code.codActe] == "undefined") {
						// Création de l'acte médical qui n'existe pas encore dans le tableau qui contient tous les actes.
						controller.medicalActs[code.codActe] = new MedicalAct();
						controller.medicalActs[code.codActe].dateModifSet(code.dtModif);
						controller.medicalActs[code.codActe].codeSet(code.codActe);
						controller.medicalActs[code.codActe].nameShortSet(code.nomCourt);
						controller.medicalActs[code.codActe].nameLongSet(code.nomLong);
					}
					controller.viewSearchCcam.tableCreate(controller, controller.medicalActs, code.codActe, f);
					f++;
				});
				
				// la var "f" représente le numéro de la ligne du tableau des résultats de recherche. Quand le tableau est fini d'être créé, on stocke le numéro + 1 de la dernière ligne dans une var car quand une nouvelle recherche a lieue "f" ne reprend pas de zero.
				controller.viewSearchCcam.resultsElementsIndexSet(f);
				
				// Le tableau des résultats de recherche a fini d'être créé.
				controller.viewSearchCcam.tableCreated();
				
				linksNext = informations.links.next;
				if (linksNext != null) {
					// Si plus de résultats peuvent être téléchargés.
					controller.viewSearchCcam.resultsMoreExists(true);
					controller.viewSearchCcam.resultsElementsUrlStartSet(urlStart);
					controller.viewSearchCcam.resultsElementsUrlPageNextSet(urlStart + linksNext);
				} else {
					controller.viewSearchCcam.resultsMoreExists(false);
				}
			} else {
				controller.viewSearchCcam.inputSearchReady(false);
			}
		}
	}
	
	// Ouverture d'un acte médical (fiche avec les tarifs).
	viewMedicalActF(controller, medicalActCode, resultAnchor) {
		controller.viewSearchCcam.pauseOn();
		controller.viewMedicalAct.backResultAnchorSet(resultAnchor);
		controller.viewMedicalAct.resultsContentLoading(medicalActCode);
		controller.viewMedicalAct.selectionReset();
		controller.viewMedicalAct.priceLoading();
		controller.viewMedicalAct.codeSet(medicalActCode);
		var searchDateConverted = controller.viewMedicalAct.inputSearchDateConvert(controller.viewSearchCcam.inputSearchDateGet());
		if (controller.clientRhapi.CONVENTION_PS_SECTORS_DATE_Get() < searchDateConverted) {
			var gridCodeDefault = 1;
		} else {
			var gridCodeDefault = 0;
		}
		controller.viewMedicalAct.gridCodeSet(gridCodeDefault);
		controller.viewMedicalAct.domCodeSet(0);
		var medicalActGridCode = null;
		var medicalActDomCode = null;
		controller.viewMedicalActUpdate2(controller, medicalActCode, medicalActGridCode, medicalActDomCode);
	}
	
	// [1/4] Mise à jour des données (notes, tarif...) d'un acte médical.
	viewMedicalActUpdate(controller) {
		var selectionResults = controller.viewMedicalAct.selectionGet();
		controller.viewMedicalAct.gridCodeSet(selectionResults["medicalActGridCode"]);
		controller.viewMedicalAct.domCodeSet(selectionResults["medicalActDomCode"]);
		controller.viewMedicalAct.modificatorsCodesSet(selectionResults["medicalActModificatorsCodes"]);
		controller.viewMedicalActUpdate2(controller, controller.viewMedicalAct.codeGet(), selectionResults["medicalActGridCode"], selectionResults["medicalActDomCode"], selectionResults["medicalActModificatorsCodes"]);
	}
	
	// [2/4] Mise à jour des données (notes, tarif...) d'un acte médical.
	viewMedicalActUpdate2(controller, medicalActCode, medicalActGridCode, medicalActDomCode, medicalActModificatorsCodes) {
		controller.viewMedicalAct.priceLoading();
		var inputVal = controller.viewSearchCcam.inputSearchKeywordGet();
		var dataUrl = controller.clientRhapi.serverDataUrlPrepare(inputVal, medicalActCode, medicalActGridCode, medicalActDomCode, medicalActModificatorsCodes);
		var urlStart = dataUrl["urlStart"];
		var urlMedicalAct = dataUrl["urlMedicalAct"];
		
		var htmlResultsReset = false;
		// Le cinquième paramètre est la fonction callback
		controller.clientRhapi.serverDataGet(controller, urlStart, urlMedicalAct, htmlResultsReset, controller.viewMedicalActUpdateResults);
	}
	
	// [3/4] Mise à jour des données (notes, tarif...) d'un acte médical.
	viewMedicalActUpdateResults(controller, urlStart, urlComplete, datas, htmlResultsReset) {
		controller.viewMedicalAct.resultsContentLoaded();
		controller.viewMedicalAct.resumeOn();
		var medicalActCode = controller.viewMedicalAct.codeGet();
		var medicalActGridCode = controller.viewMedicalAct.gridCodeGet();
		var medicalActDomCode = controller.viewMedicalAct.domCodeGet();
		var medicalActModificatorsCodes = controller.viewMedicalAct.modificatorsCodesGet();
		
		controller.viewMedicalAct.subtitleSet(datas.nomLong);
		controller.viewMedicalAct.notesReset();
		f = 0;
		datas.notes.forEach(function(object){
			controller.medicalActs[medicalActCode].notesSet(object.texteNote);
			controller.viewMedicalAct.notesSet(controller.medicalActs, medicalActCode, f);
			f++;
		});
		
		var option, f = 0;
		var dateSelected;
		var serverDataContext = controller.clientRhapi.serverDataContextGet();
		serverDataContext.tb23.forEach(function(object){
			dateSelected = controller.viewMedicalAct.inputSearchDateConvert(controller.viewSearchCcam.inputSearchDateGet());
			controller.viewMedicalAct.conventionPsCreate(medicalActGridCode, controller.clientRhapi.CONVENTION_PS_SECTORS_DATE_Get(), datas, object, dateSelected, f);
			f++;
		});
		controller.viewMedicalAct.domReset();
		controller.viewMedicalAct.domCreate(medicalActDomCode, 0, controller.viewMedicalAct.DOM_LABEL_DEFAULT_Get(), 0);
		f = 1;
		serverDataContext.dom.forEach(function(object){
			controller.viewMedicalAct.domCreate(medicalActDomCode, object.codDom, object.libelle, f);
			f++;
		});
		controller.viewMedicalAct.modificatorReset();
		f = controller.viewMedicalAct.modificatorsCodesIndexGet();
		serverDataContext.tb11.forEach(function(modificator){
			dateSelected = controller.viewMedicalAct.inputSearchDateConvert(controller.viewSearchCcam.inputSearchDateGet());
			controller.viewMedicalAct.modificatorCreate(controller, medicalActModificatorsCodes, modificator, medicalActGridCode, dateSelected, f);
			f++;
		});
		controller.viewMedicalAct.modificatorsCodesIndexSet(f);
		var inputVal = controller.viewSearchCcam.inputSearchKeywordGet();
		var htmlResultsReset = true;
		var dataUrl = controller.clientRhapi.serverDataUrlPrepare(inputVal, medicalActCode, medicalActGridCode, medicalActDomCode, medicalActModificatorsCodes);
		controller.clientRhapi.serverDataGet(controller, dataUrl["urlStart"], dataUrl["urlPrice"], htmlResultsReset, controller.viewMedicalActUpdatePrice);
	}
	
	// [4/4] Mise à jour des données (notes, tarif...) d'un acte médical.
	viewMedicalActUpdatePrice (controller, urlStart, urlComplete, datas, htmlResultsReset) {
		controller.viewMedicalAct.priceLoaded();
		controller.viewMedicalAct.priceSet(datas.pu);
	}
}

$(document).ready(function() {
	var controller = new Controller();
	controller.controlContext();
});