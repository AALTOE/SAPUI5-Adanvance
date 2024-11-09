sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @param {sap.ui.Filter} Filter
     * @param {sap.ui.FilterOperator} FilterOperator
     * @returns 
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            //Variable para crear la instancia o nuevo modelo con JSONModel
            var oJSONModel = new sap.ui.model.json.JSONModel();
            //Variable para obtener la instancia de la vista
            var oView = this.getView();
            //Variable para acceder al modelo del i18n
            var i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            //Creación del objeto JSON
            var oJSON = {
                EmployeeId: "",
                CountryKey: "",
                ListCountry: [
                    {
                        Key: "US",
                        Text: "United States"
                    },
                    {
                        Key: "UK",
                        Text: "United Kindom"
                    },
                    {
                        Key: "ES",
                        Text: "Spain"
                    }
                ],
                Employees: [
                    {
                        EmployeeID: "1",
                        LastName: "García Lopez",
                        FirstName: "María",
                        Country: "ES",
                        City: "Madrid",
                        PostalCode: "28021",
                        Orders: [
                            {
                                "OrderID": "208",
                                "Freight": "65",
                                "ShipAddress": "Calle Alcala"
                            },
                            {
                                "OrderID": "2096",
                                "Freight": "21",
                                "ShipAddress": "Calle Mayor"
                            }
                        ]
                    },
                    {
                        EmployeeID: "2",
                        LastName: "Fernandez Díaz",
                        FirstName: "Pedro",
                        Country: "ES",
                        City: "Granada",
                        PostalCode: "18008",
                        Orders: [
                            {
                                "OrderID": "1056",
                                "Freight": "78",
                                "ShipAddress": "Calle Alcala"
                            },
                            {
                                "OrderID": "6731",
                                "Freight": "90",
                                "ShipAddress": "Calle Mayor"
                            }
                        ]
                    },
                    {
                        EmployeeID: "3",
                        LastName: "Davolio",
                        FirstName: "Nancy",
                        Country: "US",
                        City: "Seattle",
                        PostalCode: "98052",
                        Orders: [
                            {
                                "OrderID": "789",
                                "Freight": "34",
                                "ShipAddress": "1029 - 12th Ave. S."
                            },
                            {
                                "OrderID": "3057",
                                "Freight": "12",
                                "ShipAddress": "2732 Baker Blvd."
                            }
                        ]
                    },
                    {
                        EmployeeID: "4",
                        LastName: "Peacock",
                        FirstName: "Margaret",
                        Country: "US",
                        City: "Redmond",
                        PostalCode: "08025",
                        Order: [
                            {
                                "OrderID": "100",
                                "Freight": "83",
                                "ShipAddress": "187 Suffolk Ln."
                            },
                            {
                                "OrderID": "209",
                                "Freight": "52",
                                "ShipAddress": "87 Polk St. Suite 5"
                            }
                        ]
                    },
                    {
                        EmployeeID: "5",
                        LastName: "Buchanan",
                        FirstName: "Steven",
                        Country: "UK",
                        City: "London",
                        PostalCode: "67059",
                        Orders: [
                            {
                                "OrderID": "10",
                                "Freight": "57",
                                "ShipAddress": "Brook Farm Stratford St. Mary"
                            },
                            {
                                "OrderID": "2010",
                                "Freight": "89",
                                "ShipAddress": "Fauntleroy Circus"
                            }
                        ]
                    }
                ]
            };
            //Se pasa los datos el objeto al modelo
            //oJSONModel.setData(oJSON);
            //Se cargan los datos desde un fichero
            JSONModel.loadData("./localService/mockdata/Employees.json",false);
            //Valida si se cargaron los modelos correctamente
            /*oJSONModel.attachRequestComplete(function (oEventModel){
                console.log(JSON.stringify.getData());
            })*/
            //Se vincula los datos a la vista
            oView.setModel(oJSONModel);
        }

        function onFilter(){
            //Obtenemos los datos del modelo
            var oJSON = this.getView().getModel().getData();
            //Se crea un arreglo que contiene un filtro vacio
            var filters = [];
            //Bucle de biurfación IF, valindado si no esta vacio el EmployeeID
            if(oJSON.EmployeeID !== ""){
                //Creamos un nuevo filtro donde buscar resultados comparando el EmployeeID
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId));
            }

            if(oJSON.CountryKey !== ""){
                //Creamos un nuevo filtro donde buscar resultados comparando el Contry
                filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey));
            }
            //Accdedemos a la tabla con todos sus elementos
            var oList = this.getView().byId("tableEmployee");
            //Obtenemos los items (Datos) de la tabla
            var oBinding = oList.getbinding("items");
            //Actualizamos la tabla con los resultados ya filtrados
            oBinding.filter(filters);


        }

        var Main = Controller.extend("logaligroup.logali.controller.MainView", {});
        /**
         * Función que valida la longitud dentro del input,
         * mostrando una lista cuando la longitud es igual a 6 ó
         * ocultando una lista cuando la longitud es menor a 6
         */
        Main.prototype.onValidate = function () {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.byId("labelCountry").setVisible(true);
                this.byId("slCountry").setVisible(true);
            } else {
                //inputEmployee.setDescription("NOT OK");
                this.byId("labelCountry").setVisible(false);
                this.byId("slCountry").setVisible(false);
            }
        };

        Main.prototype.onInit = onInit;
        //Main.prototype.onInit = onFilter;
        return Main;
    });
