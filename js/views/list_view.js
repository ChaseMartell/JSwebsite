import View from './view.js'
import FormView from './form_view.js';

export default class ListView extends View {
    constructor(storageService, viewModel) {
        super(storageService, viewModel["list"])
        this.entityViewModel = viewModel;

    }

    get columns() {
        return this.viewModel.columns;
    }
    get $searchInput() {
        return $("#" + this.viewModel.searchInputId);
    }
    get $clearSearchButton() {
        return $("#" + this.viewModel.clearSearchButtonId);
    }
    get $newButton() {
        return $("#" + this.viewModel.newButtonId);
    }
    get $resetButton() {
        return $("#" + this.viewModel.resetButtonId);
    }
    get $deleteModal() {
        return $("#" + this.viewModel.deleteModalContainerId);
    }
    get $editModal() {
        return $("#" + this.viewModel.editModalContainerId);
    }
    get $headerIcon() {
        return $(`#${this.storage.sortCol}-${this.storage.sortDir}`)
    }
    get popoversEnabled() {
        return this.viewModel.enablepopovers
    }


    get entityName(){
        let str=this.entityViewModel.entitySingle;
        return str[0].toUpperCase()+ str.substring(1);
    }


    async getViewData() {
        return await this.storage.list();
    }


    async editItem(itemId) {
        this._formView = new FormView(this.storage, this.entityViewModel, this)
        this._formView.currentItemId = itemId;
        await this._formView.render();
    }


    async createItem() {
       this.editItem(null);
    }


    async bindItemEvents(data) {
        let that = this;
        for(let col of this.columns) {
            $(`th[data-name = '${col.name}']`).off("click").on("click", (e)=>{
                const dataName= $(e.currentTarget).attr("data-name");
                let curDirection = this.storage.sortDir;

                if(that.storage.sortCol === dataName){
                    that.storage.sortDir = (curDirection=="asc"?"desc":"asc");
                }
                else{
                    that.storage.sortDir = "asc";
                }
                that.storage.sortCol = dataName;
                that.renderItem();
            })
        }
        that.showSortIcon(that.storage.sortCol, that.storage.sortDir);
        
        if (this.popoversEnabled){
            this.initPopover();
        }


       this.$editModal.on("show.bs.modal", function(ev) {
           let button = ev.relatedTarget;
           let rowItemId = $(button).closest("tr").attr('data-id');
           that.editItem(rowItemId);
       });
    }


    async bindWrapperEvents() {
        let that=this;
        let $deleteModal = this.$deleteModal;

        $deleteModal.on("show.bs.modal", function(ev){
            let button = ev.relatedTarget
            let rowItemId = $(button).closest("tr").attr('data-id');
            let dataItem = that.readCachedItem(rowItemId)
            let dataName = dataItem[that.viewModel.nameCol];

            var $modalTitle = $('.modal-title')

            $modalTitle.text(`Delete ${dataName}?`);
            $deleteModal.attr("data-id", rowItemId);
            $deleteModal.attr("data-name", dataName);
        });

        $("#yesButton").click((e) =>{
            let itemName= $deleteModal.attr("data-name");
            let itemId = $deleteModal.attr("data-id");

            this.renderAlert(this.storage.entitySingle, itemName);
            this.deleteItem(itemId).then((out) => {
                this.renderItem();
            }).catch((e) => {
                console.error(e);
            });   
        })
        
        this.$newButton.on("click", (e) => {
            that.createItem();
        });
        
        $('#resetView').on("click", (e) => {
            this.reset();
        });

        this.$clearSearchButton.on("click", (e) => {
            this.clearSearch();
        });
        
        this.$searchInput.on("input", (e) => {    
            this.searchVal = $(e.target).val();
            if(this.searchVal.length > 0)
            {
                this.runSearch();
            }
            else 
            {
                this.clearSearch();
            }
        });

    }


    closeEditModal(){
        this.$editModal.modal("hide");
        $('.modal-backdrop').remove();
    }


    clearSearch() {
        this.clearSearchInput();
        this.storage.filterStr = "";
        this.renderItem();
    }
    

    clearSearchInput() {
        this.$searchInput.val("");
    }


    runSearch() {
        clearTimeout(this.searchWaiter);
        this.searchWaiter = setTimeout(() => {
            if (this.searchVal.length > 1) {
              this.storage.filterStr = this.searchVal;
              this.storage.filterCol=this.storage.sortCol;
              this.renderItem();
           
            } 
        }, 250);
    }


    renderAlert(itemType, itemName) {
        let alertHtml=`<div id="deleteAlert" class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>You deleted the following ${itemType}: ${itemName}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
        this.$alertContainer.html(alertHtml);
    }


    renderPopoverTitle(item) {
        return `${item[this.viewModel.nameCol]}`;
      }


    renderPopoverBody(item) {
        let htmlContent="";
        this.columns.forEach((col, idx)=>{
        if (col.popover)
            htmlContent +=`<p>${col.label}: ${item[col.name]}</p>`;
        })
        return htmlContent;
    }


    initPopover() {
        let that=this;
        $('[data-bs-toggle="popover"]').popover({
          html: true,
          trigger : 'hover',
          delay: {
              show: "400"
          },
          title : function(){
              var index = $(this).attr("data-id");
              let item= that.readCachedItem(index);
              return that.renderPopoverTitle(item);
          },
          content : function() {
            var index = $(this).attr("data-id");
            let item= that.readCachedItem(index);
            return that.renderPopoverBody(item);
          }
      });
    }


    async deleteItem(id) {
        await this.storage.delete(id);
        await this.renderItem();
    }


    hideSortIcons() {
        $(".toggleIcon").hide();
    }


    showSortIcon(col, dir) {
        $(`#${col}-${dir}`).show();
    }


    hideSortIcon(col, dir) {
        $(`#${col}-${dir}`).hide();
    }


}