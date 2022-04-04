import LocalStorageService from '../models/local_storage_service.js'
import ListView from '../views/list_view.js'

export default class AppController
{
   constructor(appViewModel)
   {
        this.appViewModel = appViewModel;

        this.storageService = new LocalStorageService(this.data, this.entity, this.entitySingle, this.options);

        this.view = new ListView(this.storageService, this.appViewModel.viewModel);
       
    }
    get data(){return this.appViewModel.viewModel.data;}
    get entity(){return this.appViewModel.viewModel.entity;}
    get entitySingle(){return this.appViewModel.viewModel.entitySingle;}
    get options() {return this.appViewModel.viewModel.list.options;}
    
    async reset(){
        await this.view.reset();
    }
    async render(){
       await this.view.render();
    }
}
