# CCAM
Recherche dans la Classification Commune des Actes Médicaux

## Pour tester
- Télécharger l'archive, l'ouvrir et cliquer sur index.html.
- Aller sur le site [CCAM en ligne](https://download.oremia.com/CCAM?texte=trijumeau).

## Présentation rapide
**RHAPI** est une API RESTful qui s'inscrit totalement dans l'émergence actuelle d'applications Web *full Front-End*, écrites uniquement en JavaScript.

**RHAPI** fournit l'ensemble de l'architecture *Back-End* ainsi que les logiques *Métiers*, pour des applications à destination des professionels de santé dont il ne restera qu'à développer l'interface utilisateur.

[Zumatec](http://www.zumatec.com) propose ici un exemple utilisant les fonctionnalités CCAM de RHAPI.

Comme la plupart des API RESTful, RHAPI est explorable directement depuis un navigateur ou une application telle que `curl`.

Pour retrouver les mots clefs et les codes des actes associés à un terme médical comme *trijumeau*, on peut ainsi faire une simple requête `GET` sur le serveur de démonstration RHAPI qui retournera la réponse sous forme d'un objet *JSON*.
  - [https://demo.rhapi.net/demo01/CCAM?texte=trijumeau](https://demo.rhapi.net/demo01/CCAM?texte=trijumeau)
  - `curl https://demo.rhapi.net/demo01/CCAM?texte=trijumeau`

Pour obtenir les données complètes d'un acte à partir de son code CCAM.

  - [https://demo.rhapi.net/demo01/CCAM/ADLB001](https://demo.rhapi.net/demo01/CCAM/ADLB001)
  - `curl https://demo.rhapi.net/demo01/CCAM/ADLB001`

Pour obtenir le tarif d'un acte à partir de son code CCAM.

- [https://demo.rhapi.net/demo01/CCAM/ADLB001/tarif](https://demo.rhapi.net/demo01/CCAM/ADLB001/tarif)
- `curl https://demo.rhapi.net/demo01/CCAM/ADLB001/tarif`
    
Pour de plus amples informations vous pouvez consulter [la documentation complète RHAPI](https://demo.rhapi.net/apidoc01/).

