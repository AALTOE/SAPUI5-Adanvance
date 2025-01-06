sap.ui.define([
    "logaligroup/logali/controller/Base.controller",
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
    function (Base, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
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
            var oContext = itemPress.getBindingContext("odataNorthwind");
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
            //#region 
            /*var ordersTable = this.getView().byId("ordersTable");
            ordersTable.destroyItems();

            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("odataNorthwind");
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
            cellOrderID.bindProperty("text", "odataNorthwind>OrderID")
            columnListItem.addCell(cellOrderID);

            var cellFreight = new sap.m.Label();
            cellFreight.bindProperty("text", "odataNorthwind>Freight")
            columnListItem.addCell(cellFreight);

            var cellShipAddress = new sap.m.Label();
            cellShipAddress.bindProperty("text", "odataNorthwind>ShipAddress")
            columnListItem.addCell(cellShipAddress);

            var oBindingInfo = {
                model : "odataNorthwind",
                path : "Orders",
                template : columnListItem
            }
            newTableJSON.bindAggregation("items", oBindingInfo);
            newTableJSON.bindElement("odataNorthwind>" + oContext.getPath());

            ordersTable.addItem(newTableJSON);*/
            //#endregion
            //Get selected controller
            var iconPress = oEvent.getSource();
            //Conext from model
            var oContext = iconPress.getBindingContext("odataNorthwind");

            if(!this._odialogOrders) {
                this._odialogOrders = sap.ui.xmlfragment("logaligroup.logali.fragment.DialogOrders",this);
                this.getView().addDependent(this._odialogOrders);
            };

            //Obtenemos los datos del json y lo mandamos al dialogo
            this._odialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
            this._odialogOrders.open();
        };
        /**
         * Función que cierra el dialogo
         * @param {*} oEvent 
         */
        function onCloseOrders (oEvent){
            this._odialogOrders.close();
        };
        /**
         * 
         * @param {*} oEvent 
         */
        function showEmployee (oEvent) {
            var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
            this._bus.publish("flexible", "showEmployee", path);
        };

        var Main = Base.extend("logaligroup.logali.controller.MasterEmployee", {});
       
        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;

        return Main;
    });
