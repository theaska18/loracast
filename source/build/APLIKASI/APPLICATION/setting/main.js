/*
	import cmp.ipanel
	import cmp.itextarea
	import cmp.idynamicoption
	import cmp.ifotoupload
	import cmp.iinput
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'ctrl+s',
			fn:function(){
				_click('SETTING.btnSave');
			}
		}
	]
});
new Ext.Panel({
	id : 'SETTING.main',
	layout:'fit',
	border:false,
	items:[
		{
			xtype:'ipanel',
			id:'SETTING.panel',
			// title:'Penyewa',
			layout:'column',
			submit:'SETTING.btnSave',
			tbar:[
				{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'SETTING.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('SETTING.panel').qGetForm(true);
						if(req == false)
							var param = Ext.getCmp('SETTING.panel').qParams();
							Ext.Ajax.request({
								url : url + 'cmd?m=SETTING&f=save',
								method : 'POST',
								params:param,
								before:function(){
									Ext.getCmp('SETTING.panel').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('SETTING.panel').setLoading(false);
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('SETTING.panel').setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
					}
				},'->','<b>Pengaturan</b>','->'
			],
			items:[
				{
					xtype:'form',
					width:350,
					border:false,
					cls:'i-transparent',
					items:[
						{
							xtype:'itextfield',
							id:'SETTING.f1',
							submit:'SETTING.panel',
							fieldLabel:'Kode',
							readOnly:true
						},{
							xtype:'itextfield',
							id:'SETTING.f2',
							submit:'SETTING.panel',
							name:'f2',
							property:{
								dynamic:true
							},
							allowBlank : false,
							fieldLabel:'Nama'
						},{
							xtype:'itextarea',
							id:'SETTING.f3',
							submit:'SETTING.panel',
							fieldLabel:'Deskripsi',
							name:'f3'
						},{
							xtype:'itextarea',
							id:'SETTING.f4',
							submit:'SETTING.panel',
							name:'f4',
							fieldLabel:'Alamat',
							allowBlank : false
						}
					]
				},{
					xtype:'form',
					width:350,
					border:false,
					cls:'i-transparent',
					items:[
						{
							xtype:'idynamicoption',
							name:'f5',
							submit:'SETTING.panel',
							type:'DYNAMIC_CITY',
							id:'SETTING.f5',
							fieldLabel:'Kota',
							allowBlank : false
						},{
							xtype:'itextfield',
							id:'SETTING.f6',
							submit:'SETTING.panel',
							name:'f6',
							fieldLabel:'Telepon',
							allowBlank : false
						},{
							xtype:'itextfield',
							id:'SETTING.f7',
							submit:'SETTING.panel',
							name:'f7',
							fieldLabel:'No. Fax'
						},{
							xtype:'iinput',
							label:'Logo',
							items:[
								{
									xtype:'ifotoupload',
									name: 'f8',
									id:'SETTING.f8'
								}
							]
						}
					]
				}
			]
		}
	]
});