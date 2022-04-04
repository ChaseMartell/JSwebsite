import Utils from '../util/utilities.js'
export default class View {
  constructor(storage, viewModel) {
    this.storage = storage;
    this.viewModel = viewModel;
    this.utils = new Utils();
    this.data=null;
  }
  get $alertContainer() {
    return $("#" + this.viewModel.alertContainerId);
  } 
  get wrapperTemplateUrl() {
    return this.viewModel.wrapperTemplateUrl;
  }
  get hasWrapper() {
    return this.viewModel.wrapperTemplateUrl;
  }
  get $wrapperContainer() {
    return $("#" + this.viewModel.wrapperContainerId);
  }
  get $container() {
    return $("#" + this.viewModel.containerId);
  }
  get templateUrl() {
    return this.viewModel.templateUrl;
  }

  
  async render() {
     this.renderWrapper().then(() => {
        this.renderItem();
    })
  }
  

  async renderTemplate($container, templateUrl, viewData) {
    $container.empty().hide();

    let template = await this.utils.getFileContents(templateUrl)
    let html = await ejs.render(template, viewData);
    $container.html(html);

    $container.show()
  }


  async renderWrapper() {
    if (this.wrapperTemplateUrl) {
        this.data = await this.getViewData();
        let viewData = {
            view: this,
            viewModel: this.viewModel,
            data: this.data
        }

        await this.renderTemplate(this.$wrapperContainer, this.wrapperTemplateUrl, viewData);
        this.bindWrapperEvents();
    }
  }


  async renderItem() {
    this.data = await this.getViewData();
    let viewData = {
        view: this,
        viewModel: this.viewModel,
        data: this.data
    }

    await this.renderTemplate(this.$container, this.templateUrl, viewData);
    this.bindItemEvents();
  }
  

  async getViewData() {
    throw new Error("must implement getViewData in sub class!")
  }


  async reset() {
    await this.storage.reset();
    await this.render();
  }
  

  async bindItemEvents() {
    throw new Error("must implement bindItemEvents in sub class!")
  }


  async bindWrapperEvents() {
    throw new Error("must implement bindWrapperEvents in sub class!")
  }


  readCachedItem(id) {   
    return this.storage.getItem(id);
  }
}