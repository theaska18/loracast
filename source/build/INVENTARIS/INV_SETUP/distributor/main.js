/*
	import cmp.ipanel
	import cmp.icomboquery
	import cmp.idynamicoption
	import cmp.icombobox
	import cmp.itable
	import cmp.iconfig
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('DISTRIBUTOR.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('DISTRIBUTOR.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('DISTRIBUTOR.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('DISTRIBUTOR.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'DISTRIBUTOR.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'DISTRIBUTOR.search',
			modal:false,
			title:'Vendor - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('DISTRIBUTOR.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('DISTRIBUTOR.search.f1').focus();
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
					text:'Cari',
					tooltip:'Cari <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search fa-green',
					id:'DISTRIBUTOR.search.btnSearch',
					handler: function() {
						Ext.getCmp('DISTRIBUTOR.list').refresh(true);
					}
				},{
					text:'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'DISTRIBUTOR.search.btnReset',
					handler: function() {
						Ext.getCmp('DISTRIBUTOR.search.panel').qReset();
					}
				},{
					text:'Export',
					tooltip:'Export',
					id:'DISTRIBUTOR.search.btnExport',
					iconCls: 'fa fa-file-excel-o',
					handler:function(a){
						Ext.getCmp('DISTRIBUTOR.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'DISTRIBUTOR.export',
							onY : function() {
								window.open(url+'cmd?m=DISTRIBUTOR&f=toExcel&session='+_session_id+serialize(Ext.getCmp('DISTRIBUTOR.search.panel').qParams()));
							}
						})
					}
				},{
					text: 'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('DISTRIBUTOR.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'DISTRIBUTOR.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Vendor',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							id:'DISTRIBUTOR.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Vendor',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							}
						},{
							xtype:'icomboquery',
							name : 'f3',
							fieldLabel:'Jenis Vendor',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							query:"SELECT distributor_type_id AS id,CONCAT(distributor_type_code,' - ',distributor_type_name) AS text FROM inv_distributor_type WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY distributor_type_code ASC",
						},{
							xtype:'itextfield',
							name:'f14',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							fieldLabel:'No. PAK',
						},{
							xtype:'itextfield',
							name:'f4',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							fieldLabel:'PIC',
						},{
							xtype:'itextfield',
							name:'f5',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							fieldLabel:'Email',
						},{
							xtype:'itextfield',
							name:'f15',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							fieldLabel:'Telepon',
						},{
							xtype:'itextfield',
							name:'f16',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							fieldLabel:'Fax',
						},,{
							xtype:'itextfield',
							name:'f17',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							fieldLabel:'ID Distributor',
						},{
							xtype:'itextfield',
							name:'f6',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							fieldLabel:'Alamat',
						},{
							xtype:'idynamicoption',
							name:'f7',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							type:'DYNAMIC_COUNTRY',
							fieldLabel:'Negara',
						},{
							xtype:'idynamicoption',
							name:'f8',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							type:'DYNAMIC_PROV',
							fieldLabel:'Provinsi',
							getParent:function(){
								return Ext.getCmp('DISTRIBUTOR.input.f7').getValue();	
							}
						},{
							xtype:'idynamicoption',
							name:'f9',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							type:'DYNAMIC_CITY',
							fieldLabel:'Kota',
							getParent:function(){
								return Ext.getCmp('DISTRIBUTOR.input.f8').getValue();	
							}
						},{
							xtype:'idynamicoption',
							name:'f10',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							type:'DYNAMIC_KEC',
							fieldLabel:'Kecamatan',
							getParent:function(){
								return Ext.getCmp('DISTRIBUTOR.input.f9').getValue();	
							}
						},{
							xtype:'idynamicoption',
							name:'f11',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								}
							},
							type:'DYNAMIC_KEL',
							fieldLabel:'Keluarahan',
							getParent:function(){
								return Ext.getCmp('DISTRIBUTOR.input.f10').getValue();	
							}
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f12',
							width: 200,
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								},
							},
							fieldLabel:'Izin'
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f13',
							width: 200,
							press:{
								enter:function(){
									_click('DISTRIBUTOR.search.btnSearch');
								},
							},
							fieldLabel: 'Aktif'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'DISTRIBUTOR.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('DISTRIBUTOR.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('DISTRIBUTOR.dropdown').getValue()]=Ext.getCmp('DISTRIBUTOR.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=DISTRIBUTOR&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('DISTRIBUTOR_DELETE',function(){
						Ext.getCmp('DISTRIBUTOR.confirm').confirm({
							msg : "Apakah akan Hapus Kode vendor '"+a.f1+"'",
							allow : 'DISTRIBUTOR.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=DISTRIBUTOR&f=delete',
									method : 'POST',
									params : {i : a.i},
									before:function(){
										Ext.getCmp('DISTRIBUTOR.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('DISTRIBUTOR.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('DISTRIBUTOR.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('DISTRIBUTOR.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('DISTRIBUTOR_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=DISTRIBUTOR&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('DISTRIBUTOR.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('DISTRIBUTOR.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('DISTRIBUTOR.input.panel').qReset();
									Ext.getCmp('DISTRIBUTOR.input.f1').setValue(a.f1);
									Ext.getCmp('DISTRIBUTOR.input.f2').setValue(a.f2);
									Ext.getCmp('DISTRIBUTOR.input.f3').setValue(o.f3);
									Ext.getCmp('DISTRIBUTOR.input.f4').setValue(o.f4);
									Ext.getCmp('DISTRIBUTOR.input.f5').setValue(o.f5);
									Ext.getCmp('DISTRIBUTOR.input.f6').setValue(o.f6);
									Ext.getCmp('DISTRIBUTOR.input.f7').setValue(o.f7);
									Ext.getCmp('DISTRIBUTOR.input.f8').setValue(o.f8);
									Ext.getCmp('DISTRIBUTOR.input.f9').setValue(o.f9);
									Ext.getCmp('DISTRIBUTOR.input.f10').setValue(o.f10);
									Ext.getCmp('DISTRIBUTOR.input.f11').setValue(o.f11);
									Ext.getCmp('DISTRIBUTOR.input.f12').setValue(o.f12);
									Ext.getCmp('DISTRIBUTOR.input.f13').setValue(o.f13);
									Ext.getCmp('DISTRIBUTOR.input.f14').setValue(o.f14);
									Ext.getCmp('DISTRIBUTOR.input.f15').setValue(o.f15);
									Ext.getCmp('DISTRIBUTOR.input.f16').setValue(o.f16);
									Ext.getCmp('DISTRIBUTOR.input.f17').setValue(o.f17);
									Ext.getCmp('DISTRIBUTOR.input.i').setValue(a.i);
									Ext.getCmp('DISTRIBUTOR.input.p').setValue('UPDATE');
									Ext.getCmp('DISTRIBUTOR.list').hide();
									Ext.getCmp('DISTRIBUTOR.input').show();
									Ext.getCmp('DISTRIBUTOR.input.f2').focus();
									Ext.getCmp('DISTRIBUTOR.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('DISTRIBUTOR.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('DISTRIBUTOR.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('DISTRIBUTOR.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Vendor</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'DISTRIBUTOR.config',
					menuCode:'DISTRIBUTOR',
					code:[
						iif(_access('DISTRIBUTOR_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('DISTRIBUTOR_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'DISTRIBUTOR.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('DISTRIBUTOR.input.panel').qReset();
						Ext.getCmp('DISTRIBUTOR.input.p').setValue('ADD');
						Ext.getCmp('DISTRIBUTOR.list').hide();
						Ext.getCmp('DISTRIBUTOR.input').show();
						if(getSetting('DISTRIBUTOR','SEQUENCE')=='Y'){
							Ext.getCmp('DISTRIBUTOR.input.f1').setReadOnly(true);
							Ext.getCmp('DISTRIBUTOR.input.f2').focus();
						}else{
							Ext.getCmp('DISTRIBUTOR.input.f1').setReadOnly(false);
							Ext.getCmp('DISTRIBUTOR.input.f1').focus();
						}
						Ext.getCmp('DISTRIBUTOR.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'DISTRIBUTOR.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'DISTRIBUTOR.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Vendor'},
								{id:'f1',text:'Kode Vendor'},
								{id:'f14',text:'No. PAK'},
								{id:'f4',text:'PIC'},
								{id:'f5',text:'Email'},
								{id:'f6',text:'Alamat'},
								{id:'f7',text:'Negara'},
								{id:'f8',text:'Provinsi'},
								{id:'f9',text:'Kota'},
								{id:'f10',text:'Kecamatan'},
								{id:'f11',text:'Kelurahan'},
								{id:'f15',text:'Telepon'},
								{id:'f16',text:'Fax'},
								{id:'f17',text:'ID Distributor'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('DISTRIBUTOR.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'DISTRIBUTOR.text',
							press:{
								enter:function(){
									_click('DISTRIBUTOR.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'DISTRIBUTOR.btnSearch',
							handler : function(a) {
								Ext.getCmp('DISTRIBUTOR.list').refresh(false);
							}
						},{
							tooltip:'Export',
							tooltip:'Export To Excel',
							id:'DISTRIBUTOR.btnExport',
							iconCls: 'fa fa-file-excel-o',
							handler:function(a){
								Ext.getCmp('DISTRIBUTOR.confirm').confirm({
									msg : "Apakah Akan Export Data ?",
									allow : 'DISTRIBUTOR.export',
									onY : function() {
										window.open(url+'cmd?m=DISTRIBUTOR&f=toExcel&session='+_session_id+'&'+Ext.getCmp('DISTRIBUTOR.dropdown').getValue()+'='+Ext.getCmp('DISTRIBUTOR.text').getValue());
									}
								})
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'DISTRIBUTOR.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('DISTRIBUTOR.search').show();
						Ext.getCmp('DISTRIBUTOR.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Vendor',width: 150, dataIndex: 'f1' },
				{ text: 'Nama Vendor',width:200,dataIndex: 'f2'},
				{ text: 'Jenis Vendor',width:150,dataIndex: 'f3'},
				{ text: 'Email',width:150,dataIndex: 'f5'},
				{ text: 'Alamat',flex:true,minWidth: 200,dataIndex: 'f6'},
				{ xtype:'active',dataIndex: 'f13'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('DISTRIBUTOR.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('DISTRIBUTOR.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'DISTRIBUTOR.input',
			hidden:true,
			border:false,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('DISTRIBUTOR.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('DISTRIBUTOR.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			tbar: [
				{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'DISTRIBUTOR.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('DISTRIBUTOR.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('DISTRIBUTOR.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'DISTRIBUTOR.close',
								onY : function() {
									Ext.getCmp('DISTRIBUTOR.input').hide();
									Ext.getCmp('DISTRIBUTOR.list').show();
								}
							});
						}else{
							Ext.getCmp('DISTRIBUTOR.input').hide();
							Ext.getCmp('DISTRIBUTOR.list').show();
						}
					}
				},'->','<b>Input Vendor</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'DISTRIBUTOR.input.btnSave',
					iconCls:'fa fa-save',
					handler: function() {
						var req=Ext.getCmp('DISTRIBUTOR.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('DISTRIBUTOR.confirm').confirm({
								msg : 'Apakah Akan Simpan Data ini?',
								allow : 'DISTRIBUTOR.save',
								onY : function() {
									var param = Ext.getCmp('DISTRIBUTOR.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=DISTRIBUTOR&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('DISTRIBUTOR.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('DISTRIBUTOR.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('DISTRIBUTOR.input.p').setValue('UPDATE');
												if(r.d.i!=''){
													Ext.getCmp('DISTRIBUTOR.input.i').setValue(r.d.i);
													Ext.getCmp('DISTRIBUTOR.input.f1').setValue(r.d.f1);
												}
												Ext.getCmp('DISTRIBUTOR.input.f1').setReadOnly(true);
												Ext.getCmp('DISTRIBUTOR.input.f2').focus();
												Ext.getCmp('DISTRIBUTOR.input.panel').qSetForm()
												Ext.getCmp('DISTRIBUTOR.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('DISTRIBUTOR.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else{
							if(Ext.getCmp('DISTRIBUTOR.input.p').getValue()=='ADD'){
								Ext.create('IToast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							}else{
								Ext.create('IToast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'DISTRIBUTOR.input.panel',
					submit:'DISTRIBUTOR.input.btnSave',
					layout:'column',
					items:[
						{
							xtype:'form',
							columnWidth:.5,
							border:false,
							maxWidth: 400,
							minWidth:350,
							items:[
								{
									xtype:'ihiddenfield',
									name:'p',
									id:'DISTRIBUTOR.input.p'
								},{
									xtype:'ihiddenfield',
									name:'i',
									id:'DISTRIBUTOR.input.i'
								},{
									xtype:'itextfield',
									submit:'DISTRIBUTOR.input.panel',
									maxLength:32,
									fieldLabel:'Kode Vendor',
									name:'f1',
									readOnly:true,
									property:{
										upper:true,
										space:false
									},
									id:'DISTRIBUTOR.input.f1',
									allowBlank: false
								},{
									xtype:'itextfield',
									submit:'DISTRIBUTOR.input.panel',
									name:'f2',
									fieldLabel:'Nama Vendor',
									property:{
										dynamic:true
									},
									id:'DISTRIBUTOR.input.f2',
									result:'dynamic',
									allowBlank: false
								},{
									xtype:'icomboquery',
									submit:'DISTRIBUTOR.input.panel',
									id : 'DISTRIBUTOR.input.f3',
									name : 'f3',
									fieldLabel:'Jenis Vendor',
									query:"SELECT distributor_type_id AS id,CONCAT(distributor_type_code,' - ',distributor_type_name) AS text FROM inv_distributor_type WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY distributor_type_code ASC",
									allowBlank : false
								},{
									xtype:'itextfield',
									submit:'DISTRIBUTOR.input.panel',
									name:'f14',
									fieldLabel:'No. PAK',
									id:'DISTRIBUTOR.input.f14',
									allowBlank: false
								},{
									xtype:'itextfield',
									submit:'DISTRIBUTOR.input.panel',
									name:'f4',
									fieldLabel:'PIC',
									id:'DISTRIBUTOR.input.f4',
									allowBlank: false
								},{
									xtype:'itextfield',
									submit:'DISTRIBUTOR.input.panel',
									name:'f5',
									maxLength:128,
									fieldLabel:'Email',
									id:'DISTRIBUTOR.input.f5',
									allowBlank: false
								},{
									xtype:'itextfield',
									name:'f15',
									submit:'DISTRIBUTOR.input.panel',
									maxLength:16,
									fieldLabel:'Telepon',
									id:'DISTRIBUTOR.input.f15'
								},{
									xtype:'itextfield',
									name:'f16',
									submit:'DISTRIBUTOR.input.panel',
									maxLength:16,
									fieldLabel:'Fax',
									id:'DISTRIBUTOR.input.f16'
								}
							]
						},{
							xtype:'form',
							columnWidth:.5,
							border:false,
							maxWidth: 400,
							minWidth:350,
							items:[
								{
									xtype:'itextfield',
									name:'f17',
									submit:'DISTRIBUTOR.input.panel',
									maxLength:32,
									fieldLabel:'ID Distributor',
									id:'DISTRIBUTOR.input.f17'
								},{
									xtype:'itextfield',
									name:'f6',
									submit:'DISTRIBUTOR.input.panel',
									maxLength:128,
									fieldLabel:'Alamat',
									id:'DISTRIBUTOR.input.f6',
									allowBlank: false
								},{
									xtype:'idynamicoption',
									name:'f7',
									submit:'DISTRIBUTOR.input.panel',
									type:'DYNAMIC_COUNTRY',
									fieldLabel:'Negara',
									id:'DISTRIBUTOR.input.f7',
									allowBlank: false
								},{
									xtype:'idynamicoption',
									name:'f8',
									submit:'DISTRIBUTOR.input.panel',
									type:'DYNAMIC_PROV',
									fieldLabel:'Provinsi',
									id:'DISTRIBUTOR.input.f8',
									getParent:function(){
										return Ext.getCmp('DISTRIBUTOR.input.f7').getValue();	
									},
									allowBlank: false
								},{
									xtype:'idynamicoption',
									name:'f9',
									submit:'DISTRIBUTOR.input.panel',
									type:'DYNAMIC_CITY',
									fieldLabel:'Kota',
									id:'DISTRIBUTOR.input.f9',
									getParent:function(){
										return Ext.getCmp('DISTRIBUTOR.input.f8').getValue();	
									},
									allowBlank: false
								},{
									xtype:'idynamicoption',
									name:'f10',
									submit:'DISTRIBUTOR.input.panel',
									type:'DYNAMIC_KEC',
									fieldLabel:'Kecamatan',
									id:'DISTRIBUTOR.input.f10',
									getParent:function(){
										return Ext.getCmp('DISTRIBUTOR.input.f9').getValue();	
									},
									allowBlank: false
								},{
									xtype:'idynamicoption',
									name:'f11',
									submit:'DISTRIBUTOR.input.panel',
									type:'DYNAMIC_KEL',
									fieldLabel:'Kelurahan',
									id:'DISTRIBUTOR.input.f11',
									getParent:function(){
										return Ext.getCmp('DISTRIBUTOR.input.f10').getValue();	
									},
									allowBlank: false
								},{
									xtype:'icheckbox',
									name:'f12',
									submit:'DISTRIBUTOR.input.panel',
									fieldLabel:'Izin',
									id:'DISTRIBUTOR.input.f12',
									checked:false
								},{
									xtype:'icheckbox',
									name:'f13',
									submit:'DISTRIBUTOR.input.panel',
									fieldLabel:'Aktif',
									id:'DISTRIBUTOR.input.f13',
									checked:true
								}
							]
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('DISTRIBUTOR.input.panel').qGetForm() == false)
					Ext.getCmp('DISTRIBUTOR.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang sudah diubah?',
						allow : 'DISTRIBUTOR.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},
		{xtype:'iconfirm',id : 'DISTRIBUTOR.confirm'}
	]
});