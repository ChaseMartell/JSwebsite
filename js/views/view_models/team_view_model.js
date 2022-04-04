import mockTeamData from '../../models/mock/mock_team_data.js'

var teamViewModel = {
    entity: "teams",
    entitySingle: "team",
    data: mockTeamData,
    list: {
        deleteModalContainerId : "deleteModal",
        editModalContainerId : "editModal",
        alertContainerId: "alertContainer",
        wrapperContainerId: "teamPageWrapper",
        wrapperTemplateUrl: "js/views/partials/list_page_wrapper.ejs",
        templateUrl: "js/views/partials/list_view.ejs",
        containerId:"tableContainer",
        searchInputId: "searchInput",
        resetButtonId: "resetView",
        newButtonId: "newButton", 
        clearSearchButtonId: "clearSearch",

        options: {
            sortCol: "name",
            sortDir: "asc",
            limit: "",
            offset: "",
            filterCol: "",
            filterStr: ""
        },
        listTitle: "Pokémon League Trainers/Teams",
       
        id: "my-list",
        tableClasses: "table table-bordered table-striped table-hover mt-2",
        thClasses:"bg-black bg-gradient text-white",
        nameCol: "name",

        enablepopovers : true,
        columns: [
            {
                label: "Team Name",
                name: "name",
                popover: "true"
            },

            {
                label: "Trainer",
                name: "trainer",
                popover: "true"
            },

            {
                label: "Team Rating",
                name: "rating",
                popover: "true"
            }
        ]
    },
    
    form: {
        id: "team-form",
        wrapperContainerId: "",
        wrapperTemplateUrl: "",

        templateUrl: "js/views/partials/form_view.ejs",
        containerId:"formContainer", 
        
        addFormTitle: "Add Team",
        editFormTitle: "Edit Team",

        actionUrl: "",
        method: "POST",

        fields: [
            {
                label: "id",
                name: "id",
                tag: "input",
                defaultValue:"",
                attributes: {
                    type: "hidden",
                },
                validation: {
                    required: false,
                }
            },
            {
                label: "Team Name",
                name: "name",
                tag: "input",
                defaultValue:"",
                attributes: { 
                    type: "text",
                    placeholder: "Enter your Team name here",
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Team Name is required."
                }
            },
            {
                label: "Trainer Name",
                name: "trainer",
                tag: "input",
                defaultValue:"",
                attributes: {
                    type: "text",
                    placeholder: "Enter your Trainer name here",
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Trainer Name is required."
                }
            },
            {
                label: "Team Rating",
                name: "rating",
                tag: "input",
                defaultValue:"",
                attributes: {
                    type: "number",
                    placeholder: "Enter your Team rating here (0-99)",
                    pattern: '^(0?[1-9]|[1-9][0-9])$',
                    title: 'Team Rating (1-99)',
                    class: "form-control"
                },
                validation: {
                    required: true,
                    requiredMessage: "Team Rating between 0-99 is required."
                }
            }
        ]     
    },
     
}
    
export default teamViewModel;