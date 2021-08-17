_var.INV_REPORT_B_2={};
_var.INV_REPORT_B_2.win=new Ext.Window({
	title:'Laporan Kartu Stok',
	closeAction:'hide',
	tbar:[
		{
			xtype:'iconfig',
			menuCode:'INV_REPORT_B_2',
			code:[
				iif(_access('INV_REPORT_B_2_config_UNIT_ID')==false,'UNIT_ID',null)
			]
		}
	],
	fbar: [
		{
			text: 'Ok',
			tooltip:'Cari <b>[Ctrl+s]</b>',
			iconCls:'fa fa-search',
			id:'INV_REPORT_B_2.btnOk',
			handler: function() {
				var req=Ext.getCmp('INV_REPORT_B_2.panel').qGetForm(true);
				if(req == false){
					window.open(url+'cmd?m=INV_REPORT_B_2&f=toExcel&session='+_session_id+serialize(Ext.getCmp('INV_REPORT_B_2.panel').qParams()));
				}
			}
		},{
			text:'Reset',
			tooltip:'Reset <b>[Ctrl+r]</b>',
			iconCls:'fa fa-eraser',
			id:'INV_RCV_VENDOR.btnReset',
			handler: function() {
				Ext.getCmp('INV_REPORT_B_2.panel').qReset();
			}
		},{
			text: 'Keluar',
			tooltip:'Keluar <b>[Esc]</b>',
			iconCls:'fa fa-close',
			handler: function() {
				_var.INV_REPORT_B_2.win.close();
			}
		}
	],
	items:[
		{
			xtype:'ipanel',
			id : 'INV_REPORT_B_2.panel',
			width: 350,
			items:[
				{
					xtype:'iselect',
					allowBlank : false,
					valueField:'i',
					textField:'name',
					fieldLabel:'Barang',
					name:'barang',
					button:{
						urlData : url + 'cmd?m=INV_REPORT_B_2&f=getListItem',
						windowWidth: 800,
						items:[
							{
								xtype:'itextfield',
								name:'f2',
								fieldLabel:'Nama Barang',
							},{
								xtype:'itextfield',
								name:'f1',
								fieldLabel:'Kode Barang',
							},{
								xtype:'itextfield',
								name:'f3',
								fieldLabel:'Deskripsi',
							},{
								xtype:'idropdown',
								id : 'ITEM.search.f4',
								fieldLabel:'Jenis Barang',
								parameter:'ITEM_TYPE',
								name : 'f4',
							},{
								xtype:'idropdown',
								parameter:'ACTIVE_FLAG',
								name : 'f5',
								width: 200,
								fieldLabel: 'Active'
							}
						],
						columns:[
							{ hidden:true,hideable:false,dataIndex: 'i'},
							{ text: 'Barang',width: 200, dataIndex: 'name'},
							{ text: 'Jenis Barang',width: 100, dataIndex:'type'},
							{ text: 'Satuan Beli',width: 100, dataIndex:'mou' },
							{ text: 'Deskripsi',flex: 1,dataIndex: 'description'},
							{ text: 'Aktif',width: 50,sortable :false,dataIndex: 'a',align:'center',
								renderer: function(value){
									if(value==true)
										return '<span class="fa fa-check"></span>';
									return '<span class="fa fa-close"></span>';
								}
							}
						]
					}
				},{
					xtype:'iinput',
					label : 'Periode',
					items : [
						{
							xtype:'idatefield',
							id : 'INV_REPORT_B_2.f1',
							name : 'f1',
							allowBlank : false,
							margin:false,
							press:{
								enter:function(){
									_click('INV_REPORT_B_2.btnOk');
								}
							},
							emptyText: 'Awal'
						},{
							xtype:'displayfield',
							value:' &nbsp; - &nbsp; '
						},{
							xtype:'idatefield',
							id : 'INV_REPORT_B_2.f2',
							margin:false,
							allowBlank : false,
							name : 'f2',
							press:{
								enter:function(){
									_click('INV_REPORT_B_2.btnOk');
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