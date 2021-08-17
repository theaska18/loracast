_var.INV_REPORT_A_6={};
_var.INV_REPORT_A_6.win=new Ext.Window({
	title:'Laporan Penjualan Detail Per Barang',
	closeAction:'hide',
	resizable:false,
	tbar:[
		{
			xtype:'iconfig',
			menuCode:'INV_REPORT_A_6',
			code:[
				iif(_access('INV_REPORT_A_6_config_UNIT_ID')==false,'UNIT_ID',null)
			]
		}
	],
	fbar: [
		{
			text: 'Ok',
			tooltip:'Ok <b>[Ctrl+s]</b>',
			iconCls:'fa fa-search',
			id:'INV_REPORT_A_6.btnOk',
			handler: function() {
				var req=Ext.getCmp('INV_REPORT_A_6.panel').qGetForm(true);
				if(req == false){
					window.open(url+'cmd?m=INV_REPORT_A_6&f=toExcel&session='+_session_id+serialize(Ext.getCmp('INV_REPORT_A_6.panel').qParams()));
				}
			}
		},{
			text:'Reset',
			tooltip:'Reset <b>[Ctrl+r]</b>',
			iconCls:'fa fa-eraser',
			id:'INV_REPORT_A_6.btnReset',
			handler: function() {
				Ext.getCmp('INV_REPORT_A_6.panel').qReset();
			}
		},{
			text: 'Keluar',
			tooltip:'Keluar <b>[Esc]</b>',
			iconCls:'fa fa-close',
			handler: function() {
				_var.INV_REPORT_A_6.win.close();
			}
		}
	],
	items:[
		{
			xtype:'ipanel',
			id : 'INV_REPORT_A_6.panel',
			width: 350,
			items:[
				{
					xtype:'iselect',
					valueField:'i',
					textField:'name',
					fieldLabel:'Barang',
					name:'barang',
					button:{
						urlData : url + 'cmd?m=INV_REPORT_A_6&f=getListItem',
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
					xtype:'iselect',
					fieldLabel:'Partners',
					id:'INV_REPORT_A_6.input.f3',
					valueField:'i',
					textField:'name',
					name:'f3',
					button:{
						urlData:url + 'cmd?m=INV_REPORT_A_6&f=getListPartners',
						windowWidth: 800,
						items:[
							{
								xtype:'itextfield',
								name:'f2',
								fieldLabel:'Nama Partner',
							},{
								xtype:'itextfield',
								name:'f1',
								fieldLabel:'Kode Partner',
							},{
								xtype:'idropdown',
								name : 'f3',
								fieldLabel:'Jenis Partner',
								query:"SELECT partners_type_id AS id,CONCAT(partners_type_code,' - ',partners_type_name) AS text FROM inv_partners_type WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY partners_type_code ASC",
							},{
								xtype:'itextfield',
								name:'f14',
								fieldLabel:'No. PAK',
							},{
								xtype:'itextfield',
								name:'f4',
								fieldLabel:'PIC',
							},{
								name:'f5',
								xtype:'itextfield',
								fieldLabel:'Email',
							},{
								name:'f15',
								xtype:'itextfield',
								fieldLabel:'Telepon',
							},{
								xtype:'itextfield',
								name:'f16',
								fieldLabel:'Fax',
							},{
								xtype:'itextfield',
								name:'f6',
								fieldLabel:'Alamat',
							},{
								xtype:'itextfield',
								name:'f7',
								type:'DYNAMIC_COUNTRY',
								fieldLabel:'Negara',
							},{
								xtype:'itextfield',
								name:'f8',
								fieldLabel:'Provinsi',
							},{
								xtype:'itextfield',
								name:'f9',
								fieldLabel:'Kota',
							},{
								xtype:'itextfield',
								name:'f10',
								fieldLabel:'Kecamatan',
							},{
								xtype:'itextfield',
								name:'f11',
								fieldLabel:'Kelurahan',
							},{
								xtype:'idropdown',
								id : 'INV_REPORT_A_6.input.f4.f12',
								parameter:'ACTIVE_FLAG',
								name : 'f12',
								fieldLabel:'Perizinan'
							},{
								xtype:'idropdown',
								parameter:'ACTIVE_FLAG',
								name : 'f13',
								width: 200,
								fieldLabel: 'Aktif'
							}
						],
						columns:[
							{ hidden:true,dataIndex: 'i'},
							{ text: 'Partner',width: 200, dataIndex: 'name'  },
							{ text: 'Jenis Partner',width: 200,dataIndex: 'type' },
							{ text: 'Email',width: 150, dataIndex:'email'},
							{ text: 'Alamat',flex:1, dataIndex: 'address' },
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
							id : 'INV_REPORT_A_6.f1',
							name : 'f1',
							allowBlank : false,
							margin:false,
							press:{
								enter:function(){
									_click('INV_REPORT_A_6.btnOk');
								}
							},
							emptyText: 'Awal'
						},{
							xtype:'displayfield',
							value:' &nbsp; - &nbsp; '
						},{
							xtype:'idatefield',
							id : 'INV_REPORT_A_6.f2',
							margin:false,
							allowBlank : false,
							name : 'f2',
							press:{
								enter:function(){
									_click('INV_REPORT_A_6.btnOk');
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