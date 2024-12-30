sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/logali/model/formatter",
    "sap/m/MessageBox"
], function (Controller, formatter, MessageBox) {

    function onInit() {
        this._bus = sap.ui.getCore().getEventBus(); 
    };
    /**
     * Función que se encarga de realizar el binding del índice para el modelo incidenceModel.
     * Tambien al preisonar el boton se crea una nueva fila con los elementos selec, date, input y select
     */
    function onCreateIncidence(){
        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.logali.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index : index + 1, _ValidateDate: false, EnableSave : false});
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence)
    };
    /**
     * Funcion que elimina alguna incidencia
     * @param {*} oEvent 
     */
    function onDeleteInsidence (oEvent){
        //Obtiene todo el objeto del item seleccionado
        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

        MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"), {
            //Mostramos un mensaje al usuario para validar si realmente quiere eliminar el elemento
            onClose : function (oAction){
                if (oAction === "OK"){
                    //Publicamos un evento
                    this._bus.publish("incidence", "onDeleteIncidence", { 
                        IncidenceId : contextObj.IncidenceId,
                        SapId : contextObj.SapId,
                        EmployeeId : contextObj.EmployeeId
                    });
                }
            }.bind(this)
        });
    };
    /**
     * Función que guarda una incidencia
     */
    function onSaveIncidence (oEvent){
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow : incidenceRow.sPath.replace('/', '')})
    };
    /**
     * Función para actualizar el campo CreationDate
     * @param {*} oEvent 
     */
    function updateIncidenceCreationDate (oEvent){
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();
        let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        //Validamos la fecha
        if(!oEvent.getSource().isValidValue()){
            contextObj._ValidateDate = false;
            contextObj.CreationDatestate = "Error"
            MessageBox.error(oResourceBundle.getText("errorCreationDareValue"), {
                title : "Error",
                onClose : null,
                styleClass : "",
                actions : MessageBox.Action.Close,
                emphasizedAction : null,
                initialFocus :null,
                textDirection: sap.ui.core.TextDirection.Inherit
            });
        }else{
            contextObj.CreationDateX = true;
            contextObj._ValidateDate = true;
            contextObj.CreationDatestate = "None"
        }
        //Validamos para habilitar el boton de guardar
        if(oEvent.getSource().isValidValue() && contextObj.Reason) {
            contextObj.EnableSave = true;
        }else{
            contextObj.EnableSave = false;
        }

        context.getModel().refresh();
    };
    /**
     * Función para actualizar el campo Reason
     * @param {*} oEvent 
     */
    function updateIncidenceReason (oEvent){
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();
        //Validamos el campo
        if(oEvent.getSource().getValue()){
            contextObj.ReasonX = true;
            contextObj.Reasonstate = "None"
        }else{
            contextObj.Reasonstate = "Error"
        }
        //Validamos para habilitar el boton de guardar
        if(contextObj._ValidateDate && oEvent.getSource().getValue()){
            contextObj.EnableSave = true;
        }else{
            contextObj.EnableSave = false;
        }

        context.getModel().refresh();
    };
    /**
     * Función para actualizar la selección Type
     * @param {*} oEvent 
     */
    function updateIncidenceType (oEvent){
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();

        //Validamos para habilitar el boton de guardar
        if(contextObj._ValidateDate && contextObj.Reason){
            contextObj.EnableSave = true;
        }else{
            contextObj.EnableSave = false;
        }
        //Inidicamos que a la bandera que se realizo una modificación
        contextObj.TypeX = true;
        context.getModel().refresh();
    };

    var Main = Controller.extend("logaligroup.logali.controller.EmployeeDetails", {});
    Main.prototype.onInit = onInit;
    Main.prototype.onCreateIncidence = onCreateIncidence;
    Main.prototype.Formatter = formatter;
    Main.prototype.onDeleteInsidence = onDeleteInsidence;
    Main.prototype.onSaveIncidence = onSaveIncidence;
    Main.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
    Main.prototype.updateIncidenceReason = updateIncidenceReason;
    Main.prototype.updateIncidenceType = updateIncidenceType;
    return Main;
});