sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/routing/History",
      "sap/m/MessageBox",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator"
    ],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     * @param {sap.ui.core.routing.History} History 
     * @param {sap.m.MessageBox} MessageBox 
     * @param {sap.ui.model.Filter} Filter 
     * @param {sap.ui.model.FilterOperator} FilterOperator 
     * @returns 
     */
    function (Controller, History, MessageBox, Filter, FilterOperator) {
      "use strict";
      
      function _onObjectMatched(oEvent){
        this.onClearSignature();

        this.getView().bindElement({
          path : "/Orders("+ oEvent.getParameter("arguments").OrderID +")",
          model : "odataNorthwind",
          events : {
            dataReceived : function(oData){
              _redSignature.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
            }.bind(this)
          }
        });

        const objContext = this.getView().getModel("odataNorthwind").getContext("/Orders("+ oEvent.getParameter("arguments").OrderID +")").getObject();
        if(objContext){
          _redSignature.bind(this)(objContext.OrderID, objContext.EmployeeID);
        }
        
      };

      /**
       * Función que obtiene la firma
       * @param {*} orderID 
       * @param {*} EmployeeID 
       */
      function _redSignature(orderID, EmployeeID){
        this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='"+orderID+"',SapId='"+this.getOwnerComponent().SapId+"',EmployeeId='"+EmployeeID+"')",{
          success : function (data){
            const signature = this.getView().byId("signature");
            if(data.MediaContent !== ""){
              signature.setSignature("data:image/png;base64,"+data.MediaContent);
            }
          }.bind(this),
          error: function (data){

          }
        });

        //Bind file
        this.byId("upliadCollection").bindAggregation("items", {
          path : "incidenceModel>/FilesSet",
          filters : [
            new Filter("OrderId",FilterOperator.EQ,orderID),
            new Filter("SapId","c24c313@logaligroup.com"),
            new Filter("EmployeeId",FilterOperator.EQ,EmployeeID)
          ],
          template : new sap.m.UploadCollectionItem({
            documentId : "{incidenceModel>AttId}",
            visibleEdit : false,
            fileName : "{incidenceModel>FileName}"
          }).attachPress(this.downloadFile)
        })
      }

      return Controller.extend("logaligroup.logali.controller.OrderDetails", {
  
        onInit: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
        },
        /**
         * Función que regresa a una pagina anterior y accede al detalle directamente pasando el ID
         * @param {*} oEvent 
         */
        onBack : function (oEvent) {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if(sPreviousHash !== undefined){
              //Regresamos a la vista anterior
              window.history.go(-1);
            }else{
              //Aqui llega directamente a la vista de los detalles
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("RouteMain", true);
            }
        },

        onClearSignature : function () {
          var signature = this.byId("signature");
          signature.clear();
        },

        factoryOrderDetails : function (listId, oContext) {
          var contextObject = oContext.getObject();
          contextObject.Currency = "EUR";
          var unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");

          if(contextObject.Quantity <= unitsInStock){
            var objectListItem = new sap.m.ObjectListItem ({
                title : "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                number : "{parts : [ {path: 'odataNorthwind>UnitPrice'}, {path: 'odataNorthwind>Currency'}], type :'sap.ui.model.type.Currency', formatOptions:{showMeasure: false}}",
                numberUnit : "{odataNorthwind>Currency}"
            });
            return objectListItem;
          }else {
            var customListItem = new sap.m.CustomListItem({
              content: [
                new sap.m.Bar({
                  contentLeft : new sap.m.Label({text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})"}),
                  contentMiddle : new sap.m.ObjectStatus({ text: "{i18n>aviableStock} {odataNorthwind>/Products(" + contextObject.ProductID + ")/UnitsInStock}", state:"Error"}),
                  contentRight : new sap.m.Label({text : "{parts : [ {path: 'odataNorthwind>UnitPrice'}, {path: 'odataNorthwind>Currency'}], type :'sap.ui.model.type.Currency'}"})
                })
              ]
            });
            return customListItem;
          }
        },

        onSaveSignature :  function (oEvent) {
          const signature = this.byId("signature");
          const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
          let signaturePNG;

          if(!signature.isFill()){
            MessageBox.error(oResourceBundle.getText("fillSignature"));
          }else{
            signaturePNG = signature.getSignature().replace("data:image/png;base64,","");
            let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
            let body = {
              OrderId : objectOrder.OrderID.toString(),
              SapId : this.getOwnerComponent().SapId,
              EmployeeId : objectOrder.EmployeeID.toString(),
              MimeType : "image/png",
              MediaContent : signaturePNG
            };

            this.getView().getModel("incidenceModel").create("/SignatureSet", body , {
              success : function () {
                MessageBox.information(oResourceBundle.getText("signatureSave"));
              },
              error : function () {
                MessageBox.error(oResourceBundle.getText("signatureNotSave"));
              }
            });
          };
        },

        onFileBeforeUpload : function (oEvent){
          let fileName = oEvent.getParameter("fileName");
          let objContext = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
          let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
            name : "slug",
            value : objContext.OrderID+";"+this.getOwnerComponent().SapId+";"+objContext.EmployeeID+";"+fileName
          });
          oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        },

        onFileChange : function (oEvent) {
          let oUploadCollection = oEvent.getSource();
          let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
            name: "x-csrf-token",
            value: this.getView().getModel("incidenceModel").getSecurityToken()
          });
          oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        },

        onFileUploadComplete : function(oEvent){
          oEvent.getSource().getBinding("items").refresh();
        },

        onFiledeleted : function (oEvent) {
          var oUploadCollection = oEvent.getSource();
          var sPath = oEvent.getParameter("item").getBindingContext("incidenceModel").getPath();
          this.getView().getModel("incidenceModel").remove(sPath, {
            success : function (){
              oUploadCollection.getBinding("items").refresh();
            },
            error : function (){

            }
          });
        }
        
    });
});