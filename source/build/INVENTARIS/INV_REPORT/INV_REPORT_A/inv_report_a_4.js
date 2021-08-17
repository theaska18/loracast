/*
	import cmp.iconfig
	import cmp.iselect
	import cmp.iinput
	import cmp.ipanel
*/
new Ext.Panel({
	tbar:[
		{
			xtype:'iconfig',
			menuCode:'INV_REPORT_A_4',
			code:[
				iif(_access('INV_REPORT_A_4_config_UNIT_ID')==false,'UNIT_ID',null)
			]
		},'->','<b>Laporan Penjualan Detail</b>','->',{
			text: 'Ok',
			xtype:'button',
			tooltip:'Ok <b>[Ctrl+s]</b>',
			iconCls:'fa fa-search',
			id:'INV_REPORT_A_4.btnOk',
			handler: function() {
				var req=Ext.getCmp('INV_REPORT_A_4.panel').qGetForm(true);
				if(req == false){
					window.open(url+'cmd?m=INV_REPORT_A_4&f=toExcel&session='+_session_id+serialize(Ext.getCmp('INV_REPORT_A_4.panel').qParams()));
				}
			}
		}
	],
	items:[
		{
			xtype:'ipanel',
			id : 'INV_REPORT_A_4.panel',
			width: 350,
			items:[
				{
					xtype:'iselect',
					fieldLabel:'Partners',
					id:'INV_REPORT_A_4.input.f3',
					valueField:'i',
					textField:'name',
					name:'f3',
					button:{
						urlData:url + 'cmd?m=INV_REPORT_A_4&f=getListPartners',
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
								id : 'INV_REPORT_A_4.input.f4.f12',
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
									if(value==true){
										return '<span class="fa fa-check fa-green"></span>';
									}
									return '<span class="fa fa-close fa-red"></span>';
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
							id : 'INV_REPORT_A_4.f1',
							name : 'f1',
							allowBlank : false,
							margin:false,
							value:new Date(),
							press:{
								enter:function(){
									_click('INV_REPORT_A_4.btnOk');
								}
							},
							emptyText: 'Awal'
						},{
							xtype:'displayfield',
							value:' &nbsp; - &nbsp; '
						},{
							xtype:'idatefield',
							id : 'INV_REPORT_A_4.f2',
							margin:false,
							value:new Date(),
							allowBlank : false,
							name : 'f2',
							press:{
								enter:function(){
									_click('INV_REPORT_A_4.btnOk');
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