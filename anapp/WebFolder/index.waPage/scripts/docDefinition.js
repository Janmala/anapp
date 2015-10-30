
var docDef = {
    pageMargin: [10,10,10,10],
    content: [
    {
        table: {
            headerRows: 0,
            widths: ['*','*'],                                             
            body: [
                [{text: "Ausbildungsnachweiß-Nr.", Rowspan: 2}, {text: "Name:"}],
                [{text: ""}, {text: "Ausbildungsjahr:"}]
            ]
        },
        layout:"noBorders"
    },

    {
            table: {
                headerRows: 0,
                widths: [90,310,42,42],
                body: [
                    [{text: "Arbeitsabteilung/ Unterrichtsfach",style:"tableBody"}, {text: "Unterrichtsthemen, Arbeitsauftäge, Unterweisungen usw.",style:"tableBody"}, {text: "Einzel- stunden",style:"tableBody"}, {text: "Gesamt- stunden",style:"tableBody"}]
                ]
            }
        },

        {
            text:"  "
        },
        {
            text:"  "
        },

        {
            table: {
                headerRows: 0,
                widths: [90,310,42,42],
                body: [
                    [{text: "Anmerkungen",style:"daySpan"}, {text: "",style:"emptyTableBody",colSpan:3}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}],
                    [{text: " ",style:" emptyTableBody",colSpan:4}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}, {text: "",style:"emptyTableBody"}]
                ]
            }
        },

        {
            text:"  "
        },

        {
            table: {
                headerRows: 0,
                widths: ['*','*'],
                body: [
                    [{text:"___________________________________",style:"lines"},{text:"___________________________________",style:"lines"}],
                    [{text:"Datum und Unterschrift des Auszubildenden",style:"underTheLine"},{text:"Datum und Unterschrift des Ausbilders/des Lehrers",style:"underTheLine"}]
                ]
            },
            layout:"headerLineOnly"
        }


    ],

    styles:{
        daySpan:{
        	fillColor: "#d3d3d3",
            fontSize: 10
        },
        tableBody:{
            fontSize: 8,
            alignment: "center"
        },
        emptyTableBody:{
            fontSize: 10,
            margin:[0,0,0,0]
        },
        underTheLine:{
            fontSize:6
        }
    }

};

