Ext.define('App.cmp.ButtonNewTab', {
	extend : 'Ext.Button',
	tooltip:'Pindah Tab',
	iconCls:'fa fa-window-restore',
	handler:function(){lib.newTabMenu();},
	initComponent:function(a){if(_single_page==true){this.disabled=true;}this.callParent();if(_mobile==true){this.hide();}}
})