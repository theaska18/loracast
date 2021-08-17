_var.INV_REPORT_C_3={};
_var.INV_REPORT_C_3.win=new Ext.Window({
	title:'Laporan Distribusi Keluar Kem-Kes',
	closeAction:'hide',
	tbar:[
		{
			xtype:'iconfig',
			menuCode:'INV_REPORT_C_3',
			code:[
				iif(_access('INV_REPORT_C_3_config_UNIT_ID')==false,'UNIT_ID',null)
			]
		}
	],
	fbar: [
		{
			text: 'Ok',
			tooltip:'Cari <b>[Ctrl+s]</b>',
			iconCls:'fa fa-search',
			id:'INV_REPORT_C_3.btnOk',
			handler: function() {
				var req=Ext.getCmp('INV_REPORT_C_3.panel').qGetForm(true);
				if(req == false){
					window.open(url+'cmd?m=INV_REPORT_C_3&f=toExcel&session='+_session_id+serialize(Ext.getCmp('INV_REPORT_C_3.panel').qParams()));
				}
			}
		},{
			text:'Reset',
			tooltip:'Reset <b>[Ctrl+r]</b>',
			iconCls:'fa fa-eraser',
			id:'INV_RCV_VENDOR.btnReset',
			handler: function() {
				Ext.getCmp('INV_REPORT_C_3.panel').qReset();
			}
		},{
			text: 'Keluar',
			tooltip:'Keluar <b>[Esc]</b>',
			iconCls:'fa fa-close',
			handler: function() {
				_var.INV_REPORT_C_3.win.close();
			}
		}
	],
	items:[
		{
			xtype:'ipanel',
			id : 'INV_REPORT_C_3.panel',
			width: 350,
			items:[
				{
					xtype:'iinput',
					label : 'Jatuh Tempo',
					items : [
						{
							xtype:'idatefield',
							id : 'INV_REPORT_C_3.f1',
							name : 'f1',
							allowBlank : false,
							margin:false,
							press:{
								enter:function(){
									_click('INV_REPORT_C_3.btnOk');
								}
							},
							emptyText: 'Awal'
						},{
							xtype:'displayfield',
							value:' &nbsp; - &nbsp; '
						},{
							xtype:'idatefield',
							id : 'INV_REPORT_C_3.f2',
							margin:false,
							allowBlank : false,
							name : 'f2',
							press:{
								enter:function(){
									_click('INV_REPORT_C_3.btnOk');
								}
							},
							emptyText: 'Akhir'
						}
					]
				}
			]
		}
	]
});