var teamViewModel = {
    entity: "teams",
    entitySingle: "team",
    wrapperContainerId: "teamPageWrapper",
    wrapperTemplateUrl: "js/views/partials/list_page_wrapper.ejs",
    listContainerId:"tableContainer",  
    listTemplateUrl: "js/views/partials/list_view.ejs",
    modalContainerId:"myModal", 
    alertContainerId: "alertContainer",
    data: mockTeamData,
    list: {
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
        
        logoCol: "teamPhoto",
        nameCol: "name",

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
    }
    
    
}
    