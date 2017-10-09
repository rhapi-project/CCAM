class MedicalAct {
    constructor () {
        this.dateModif = null;
        this.code = null;
        this.nameShort = null;
        this.nameLong = null;
        this.notes = null;
        this.codeActiviteDefault = null;
        this.codePhaseDefault = null;
    }
    
    dateModifGet () {
        return this.dateModif;
    }
    
    codeGet () {
        return this.code;
    }
    
    nameShortGet () {
        return this.nameShort;
    }
    
    nameLongGet () {
        return this.nameLong;
    }
    
    notesGet () {
        return this.notes;
    }
    
    codeActiviteDefaultGet () {
        return this.codeActiviteDefault;
    }
    
    codePhaseDefaultGet () {
        return this.codePhaseDefault;
    }
    
    dateModifSet (valNew) {
        this.dateModif = valNew;
    }
    
    codeSet (valNew) {
        this.code = valNew;
    }
    
    nameShortSet (valNew) {
        this.nameShort = valNew;
    }
    
    nameLongSet (valNew) {
        this.nameLong = valNew;
    }
    
    notesSet (valNew) {
        this.notes = valNew;
    }
    
    codeActiviteDefaultSet (valNew) {
        this.codeActiviteDefault = valNew;
    }
    
    codePhaseDefaultSet (valNew) {
        this.codePhaseDefault = valNew;
    }
}