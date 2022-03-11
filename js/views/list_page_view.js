class ListPageView 
{
    constructor(storageService, viewModel)
    {
        this.storage = storageService;
        this.viewModel = viewModel;
        this.listTemplateHtml="";
        this.wrapperTemplateHtml="";
        this.searchWaiter=null;
    }
    /* GETTERS AND SETTERS */
    get list() {
        return this.viewModel.list;
    }

    get view() {return this.viewModel;}
   
    get wrapperTemplateUrl() {return this.view.wrapperTemplateUrl;}

    get $wrapperContainer() { return $("#"+this.view.wrapperContainerId); }

    get $listContainer() { return $("#"+this.view.listContainerId); }

    get listTemplateUrl() {return this.view.listTemplateUrl;}
   
    get columns(){return this.view.list.columns;}
    
    get $alertContainer() { return $("#"+this.view.alertContainerId); }

    get $modal() {return $("#"+this.view.modalContainerId); }

    get $headerIcon() { return $(`#${this.storage.sortCol}-${this.storage.sortDir}`)}    

     reset(){
        this.storage.reset();
        this.render();
    }
    async render(){    
        await this.renderWrapper();
        await this.renderList();
    }

    async renderWrapper()
    {
        this.$wrapperContainer.empty();
        if (!this.wrapperTemplateHtml.length>0){
            this.wrapperTemplateHtml =  await this.getFileContents(this.wrapperTemplateUrl);
        }
        this.$wrapperContainer.html(ejs.render(this.wrapperTemplateHtml, { view: this.viewModel }));

        await this.bindWrapperEvents();
    }
    async renderList()
    {
        this.$listContainer.empty();
        this.data =  await this.storage.list();
 
        if (!this.listTemplateHtml.length>0){
            this.listTemplateHtml =  await this.getFileContents(this.listTemplateUrl);
        }
        this.$listContainer.html(ejs.render(this.listTemplateHtml, { view:this, data:this.data }));
        
        this.$headerIcon.show();
      
        this.bindListEvents(this.data);
    }
    
    bindListEvents(data)
    {
        let that = this;
        for(let col of this.columns) {
            $(`th[data-name = '${col.name}']`).off("click").on("click", (e)=>{
                const dataName= $(e.currentTarget).attr("data-name");
                let curDirection = this.storage.sortDir;
                $(`#${dataName}-${curDirection}`).hide();

                if(that.storage.sortCol === dataName){
                    that.storage.sortDir = (curDirection=="asc"?"desc":"asc");
                }
                else{
                    that.storage.sortDir = "asc";
                }
                $(`#${dataName}-${this.storage.sortDir}`).show();
                that.storage.sortCol = dataName;
                that.renderList();
            })
        }

        this.initPopover();
    }
    async bindWrapperEvents(){

        let that=this;
        let $myModal = this.$modal;

        $myModal.on("show.bs.modal", function(ev){
            let button = ev.relatedTarget
            let rowItemId = $(button).closest("tr").attr('data-id');

            let dataItem = that.data[that.storage.getItemIndex(rowItemId)];
            let dataName = dataItem[that.list.nameCol];

            var $modalTitle = $('.modal-title')

            $modalTitle.text(`Delete ${dataName}?`);
            $myModal.attr("data-id", rowItemId);
            $myModal.attr("data-name", dataName);
        });

        $("#yesButton").click((e) =>{
            let itemName=$myModal.attr("data-name");
            let itemId = $myModal.attr("data-id");

            this.addAlert(this.view.entitySingle, itemName);

            this.deleteListItem(itemId).then((out) => {
                this.renderList();
            }).catch((e) => {
                console.error(e);
            });   
        })
        
        $('#resetView').on("click", (e) => {
            this.reset();
        });
        $('#searchInput').on("input", (e) => {
                        
            this.searchVal = $(e.target).val();
            this.runSearch();
        });

        $('#clearSearch').off("click").on("click", (e) => {
            $('#searchInput').val("");
            this.storage.filterStr = "";
            this.renderList();
        });
    }
  
    addAlert( itemType, itemName){
        let alertHtml=`<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>You deleted the following ${itemType}: ${itemName}</span>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
        this.$alertContainer.html(alertHtml);
    }
    runSearch(){
        clearTimeout(this.searchWaiter);
        this.searchWaiter = setTimeout(() => {
            if (this.searchVal.length > 1) {
              this.storage.filterStr = this.searchVal;
              this.storage.filterCol=this.storage.sortCol;
              this.renderList();
           
            } 
        }, 250);
    }
    async deleteListItem(id)
    {
        await this.storage.delete(id);
        await this.renderList();
    }
    initPopover(){
      let that=this;
      $('[data-bs-toggle="popover"]').popover({
        html: true,
        trigger : 'hover',
        title : function(){
            var index = $(this).attr("data-id");
            let item= that.data[that.storage.getItemIndex(index)];
            return `<img class="img-fluid rounded-circle" src="${item[that.view.list.logoCol]}" width="40" height="40">  ${item[that.view.list.nameCol]} `;
        },
        content : function() {
          var index = $(this).attr("data-id");
          let item= that.data[that.storage.getItemIndex(index)];
          let htmlContent="";
          that.columns.forEach((col, idx)=>{
            if (col.popover)
              htmlContent+=`<p>${col.label}: ${item[col.name]}</p>`;
          })
          return htmlContent;
        }
    });
    }
     async getFileContents(url){
        return await $.get(url);
        
     }
}
