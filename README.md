# Lernprogramm – Quiz-App

## Projekt

Ein webbasiertes Lernprogramm zum interaktiven Üben und Testen von Wissen in verschiedenen Kategorien.

---

## Features

- Auswahl verschiedener Quiz-Kategorien
  - Mathematik (lokal)
  - Noten lernen (lokal)
  - Akkorde lernen (lokal)
  - IT (derzeit mit anderen Fragen befüllt)
- Multiple-Choice-Fragen
- Statistik am Ende (z.B. richtige Antworten, Fehler, Zeit)
- Unterstützung für mathematische Formeln (KaTeX)
- Musiknoten-Anzeige und -Abspielen (VexFlow & Tone.js)
- Responsive Design für Desktop und Mobilgeräte

---

## Verwendete Technologien

- **HTML, CSS, JavaScript (ES6)**
- Progressive Web App (PWA)
- [VexFlow](https://www.vexflow.com/) (Musiknoten)
- [Tone.js](https://tonejs.github.io/) (Sound)
- [KaTeX](https://katex.org/) (Mathe-Formeln)
- JSON
- REST-API-Anbindung (für Online-Fragen)

---

## Projektstruktur

```
Lernprogramm/
├── index.html
├── manifest.json
├── scripts/
│   ├── main.js
│   ├── model.js
│   ├── view.js
│   ├── presenter.js
│   ├── rest.js
│   ├── sw.js
│   ├── categories.json
│   ├── questions.json
│   ├── navigation-bar.css
│   └── style.css
├── images/
│   └── logo.png
└── README.md
```

---

## Bedienung

1. Kategorie auswählen
2. Anzahl der Fragen wählen und Quiz starten
3. Fragen beantworten (bei Fehlern: erneut versuchen)
4. Am Ende Statistik ansehen und ggf. neues Quiz starten

---

## Hinweise für Entwickler

- Fragen und Kategorien können in den JSON-Dateien angepasst werden.
- Für REST-API-Zugriff müssen ggf. Zugangsdaten in `rest.js` angepasst werden.
- Die App ist modular nach dem MVP-Prinzip aufgebaut (Model-View-Presenter).

---

 ## Hilfsmittel bei der Entwicklung

 Für die Entwicklung des Codes wurde häufig auf GitHub CoPilot zurückgegriffen, der Code wurde jedoch selbstständig durchdacht und erarbeitet.

 [Das Icon](images/logo.png) wurde von Microsoft CoPilot generiert.

 ChatGPT wurde verwendet, um die [Fragen](scripts/questions.json) zu generieren und gleich in nutzbarer Form (JSON) zu implementieren.

## Lizenz

Dieses Projekt ist für Ausbildungszwecke an der HTW Dresden entstanden.

---