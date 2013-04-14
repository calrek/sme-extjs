Ext.onReady(function(){

    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[{
            region:'west',
            id:'west-panel',
            title:'File Manager',
            split:true,
            width: 200,
            collapsible: true,
            margins:'5 0 5 5',
            cmargins:'5 5 5 5',
            layout:'accordion',
            layoutConfig:{
                animate:true
            },
            items: []
        },{
            region:'center',
            id:'center-panel2',
            title:'Shared files',
            split:true,
            collapsible: true,
            margins:'5 0 5 5',
            cmargins:'5 5 5 5',
            layout:'accordion',
            layoutConfig:{
                animate:true
            },
            items: [{
                html: '<div id="mainTreeFileManagerBorder" style="width:100%; height:100%; overflow:auto;"><div id="mainTreeFileManager" style=""></div></div>',
                title:'All files',
                autoScroll:true,
                border:false
            }]
            
        }]
    });
});

