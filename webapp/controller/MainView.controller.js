sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @param {sap.ui.model.Filter} Filter
     * @param {sap.ui.model.FilterOperator} FilterOperator
     * @returns 
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            //Variable para obtener la instancia de la vista
            var oView = this.getView();
            //Variable para crear la instancia o nuevo modelo con JSONModel
            var oJSONModelEmployees = new sap.ui.model.json.JSONModel();
            //Se cargan los datos desde un fichero
            oJSONModelEmployees.loadData("./localService/mockdata/Employees.json", false);
            //Se vincula los datos a la vista
            oView.setModel(oJSONModelEmployees, "jsonEmployees");
            //Creación del segundo modelo
            var oJSONModelCountries = new sap.ui.model.json.JSONModel();
            oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
            oView.setModel(oJSONModelCountries, "jsonCountries");
            //Creación del tercer modelo para mostrar y ocultar datos
            var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                visibleID: true,
                visibleName: true,
                visibleCountry: true,
                visibleCity: false,
                visibleBtnShowCity: true,
                visibleBtnHideCity: false
            });
            oView.setModel(oJSONModelConfig, "jsonCounfig");
        };

        function onFilter() {
            //Obtenemos los datos del modelo
            var oJSONCountries = this.getView().getModel("jsonCountries").getData();
            //Se crea un arreglo que contiene un filtro vacio
            var filters = [];
            //Bucle de biurfación IF, valindado si no esta vacio el EmployeeID
            if (oJSONCountries.EmployeeId !== "") {
                //Creamos un nuevo filtro donde buscar resultados comparando el EmployeeID
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            }

            if (oJSONCountries.CountryKey !== "") {
                //Creamos un nuevo filtro donde buscar resultados comparando el Contry
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            }
            //Accdedemos a la tabla con todos sus elementos
            var oList = this.getView().byId("tableEmployee");
            //Obtenemos los items (Datos) de la tabla
            var oBinding = oList.getBinding("items");
            //Actualizamos la tabla con los resultados ya filtrados
            oBinding.filter(filters);


        };

        function onClearFilter() {
            //Obtenemos los datos del modelo jsonCountries 
            var oModel = this.getView().getModel("jsonCountries");
            //Actualizamos el valor de los datos para limpiar el modelo
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");
        };

        function showPostalCode(oEvent) {
            var itemPress = oEvent.getSource();
            var oContext = itemPress.getBindingContext("jsonEmployees");
            var oObjectContext = oContext.getObject();

            sap.m.MessageToast.show(oObjectContext.PostalCode);

        };
        /**
         * Función que actualiza el modelo de configuración para mostrar la columna City
         * y ocultar el boton de motrar
         */
        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonCounfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);

        };
        /**
         * Función que actualiza el modelo de configuración para ocultar la columna City
         * y ocular el boton de ocultar
         */
        function onHideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonCounfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        };
        /**
         * Función que construye una tabla dinamica al precionar un regsitro y mostrando
         * los datos del campo Orders
         */
        function showOrders (oEvent) {
            var ordersTable = this.getView().byId("ordersTable");
            ordersTable.destroyItems();

            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var oObjectContext = oContext.getObject();
            var orders = oObjectContext.Orders;

            var ordersItems = [];

            for (var i in orders) {
                ordersItems.push(new sap.m.ColumnListItem({
                    cells : [
                        new sap.m.Label({ text: orders[i].OrderID}),
                        new sap.m.Label({ text: orders[i].Freight}),
                        new sap.m.Label({ text: orders[i].ShipAddress})
                    ]
                }));
            }

            var newTable = new sap.m.Table({
                width : "auto",
                columns : [
                    new sap.m.Column({header: new sap.m.Label({ text: "{i18n>orderID}"})}),
                    new sap.m.Column({header: new sap.m.Label({ text: "{i18n>freight}"})}),
                    new sap.m.Column({header: new sap.m.Label({ text: "{i18n>shipAddress}"})})
                ],
                items : ordersItems
            }).addStyleClass("sapUiSmallMargin");

            ordersTable.addItem(newTable);

            var newTableJSON = new sap.m.Table;
            newTableJSON.setWidth("auto");
            newTableJSON.addStyleClass("sapUiSmallMargin");

            var columnOrderID = new sap.m.Column();
            var labelOrderID = new sap.m.Label();
            labelOrderID.bindProperty("text", "i18n>orderID");
            columnOrderID.setHeader(labelOrderID);
            newTableJSON.addColumn(columnOrderID);

            var columnFreight = new sap.m.Column();
            var labelFreight = new sap.m.Label();
            labelOrderID.bindProperty("text", "i18n>freight");
            columnFreight.setHeader(labelFreight);
            newTableJSON.addColumn(columnFreight);

            var columnShipAddress = new sap.m.Column();
            var labelShipAddress = new sap.m.Label();
            labelShipAddress.bindProperty("text", "i18n>shipAddress");
            columnShipAddress.setHeader(labelShipAddress);
            newTableJSON.addColumn(columnShipAddress);

            var columnListItem = new sap.m.ColumnListItem();

            var cellOrderID = new sap.m.Label();
            cellOrderID.bindProperty("text", "jsonEmployees>OrderID")
            columnListItem.addCell(cellOrderID);

            var cellFreight = new sap.m.Label();
            cellFreight.bindProperty("text", "jsonEmployees>Freight")
            columnListItem.addCell(cellFreight);

            var cellShipAddress = new sap.m.Label();
            cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress")
            columnListItem.addCell(cellShipAddress);

            var oBindingInfo = {
                model : "jsonEmployees",
                path : "Orders",
                template : columnListItem
            }
            newTableJSON.bindAggregation("items", oBindingInfo);
            newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

            ordersTable.addItem(newTableJSON);
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
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders
        return Main;
    });
