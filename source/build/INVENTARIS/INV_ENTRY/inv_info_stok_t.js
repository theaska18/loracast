shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_INFO_STOK_T.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_INFO_STOK_T.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_INFO_STOK_T.btnShowSearch');
			}
		}
	]
});
new Ext.Panel({
	id : 'INV_INFO_STOK_T.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_INFO_STOK_T.search',
			modal:false,
			title:'Barang - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('INV_INFO_STOK_T.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_INFO_STOK_T.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_INFO_STOK_T.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_INFO_STOK_T.search.f1').focus();
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('search');
				}
			},
			fbar: [
				{
					text: 'Cari',
					tooltip:'Cari <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search',
					id:'INV_INFO_STOK_T.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_INFO_STOK_T.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_INFO_STOK_T.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_INFO_STOK_T.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_INFO_STOK_T.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_INFO_STOK_T.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'p',
							fieldLabel:'Nama Partner',
							press:{
								enter:function(){
									_click('INV_INFO_STOK_T.search.btnSearch');
								}
							},
							id:'INV_INFO_STOK_T.search.p'
						},{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Barang',
							press:{
								enter:function(){
									_click('INV_INFO_STOK_T.search.btnSearch');
								}
							},
							id:'INV_INFO_STOK_T.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Barang',
							press:{
								enter:function(){
									_click('INV_INFO_STOK_T.search.btnSearch');
								}
							}
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_INFO_STOK_T.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('INV_INFO_STOK_T.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('INV_INFO_STOK_T.dropdown').getValue()]=Ext.getCmp('INV_INFO_STOK_T.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=INV_INFO_STOK_T&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'-',{
					xtype:'iconfig',
					code:[
						iif(_access('INV_INFO_STOK_T_config_UNIT_ID')==false,'UNIT_ID',null),
					]
				},'-','->',
				{
					xtype:'idropdown',
					id : 'INV_INFO_STOK_T.dropdown',
					emptyText:'Pencarian',
					margin:false,
					value:'p',
					data:[
						{id:'p',text:'Nama Partner'},
						{id:'f2',text:'Nama Barang'},
						{id:'f1',text:'Kode Barang'},
						{id:'f3',text:'Deskripsi'},
					],
					width: 150,
					press:{
						enter:function(){
							_click('INV_INFO_STOK_T.btnSearch');
						}
					}
				},{
					xtype:'itextfield',
					width: 200,
					emptyText:'Pencarian',
					margin:false,
					tooltip:'Pencarian [Ctrl+f]',
					id:'INV_INFO_STOK_T.text',
					press:{
						enter:function(){
							_click('INV_INFO_STOK_T.btnSearch');
						}
					}
				},{
					iconCls: 'fa fa-search',
					tooltip:'Pencarian [F5]',
					id:'INV_INFO_STOK_T.btnSearch',
					handler : function(a) {
						Ext.getCmp('INV_INFO_STOK_T.list').refresh(false);
					}
				},'-',{
					text: 'Pencarian',
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_INFO_STOK_T.btnShowSearch',
					iconCls: 'fa fa-search',
					handler:function(a){
						Ext.getCmp('INV_INFO_STOK_T.search').show();
						Ext.getCmp('INV_INFO_STOK_T.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,hideable:false,dataIndex: 'i' },
				{ text: 'Partner',flex: true, dataIndex: 'p' },
				{ text: 'Kode GIN',width: 120, dataIndex: 'f8' },
				{ text: 'Kode Barang',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Barang',width: 200,dataIndex: 'f2'},
				{ text: 'Deskripsi',width: 150,dataIndex: 'f3' },
				{ text: 'Satuan Beli',width: 120, dataIndex: 'f7' },
				{ text: 'Stok',width:140,dataIndex: 'f4',align:'right',
					renderer: function(value,a){
						return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.f6;
					} 
				}
			]
		}
	]
});