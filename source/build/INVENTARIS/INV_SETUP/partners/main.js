/*
	import cmp.ipanel
	import cmp.itable
	import cmp.iconfig
	import cmp.itextarea
	import cmp.icomboquery
	import cmp.idynamicoption
	import cmp.icombobox
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('PARTNERS.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('PARTNERS.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('PARTNERS.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('PARTNERS.btnAdd');
			}
		}
	]
});
Ext.Panel({
	id : 'PARTNERS.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'PARTNERS.search',
			modal:false,
			title:'Rekan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('PARTNERS.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('PARTNERS.search.f1').focus();
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
					iconCls:'fa fa-search fa-green',
					id:'PARTNERS.search.btnSearch',
					handler: function() {
						Ext.getCmp('PARTNERS.list').refresh(true);
					}
				},{
					text:'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'PARTNERS.search.btnReset',
					handler: function() {
						Ext.getCmp('PARTNERS.search.panel').qReset();
					}
				},{
					text:'Export',
					tooltip:'Export',
					id:'PARTNERS.search.btnExport',
					iconCls: 'fa fa-file-excel-o',
					handler:function(a){
						Ext.getCmp('PARTNERS.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'PARTNERS.export',
							onY : function() {
								window.open(url+'cmd?m=PARTNERS&f=toExcel&session='+_session_id+serialize(Ext.getCmp('PARTNERS.search.panel').qParams()));
							}
						})
					}
				},{
					text: 'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('PARTNERS.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'PARTNERS.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Rekan',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							id:'PARTNERS.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Rekan',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							}
						},{
							xtype:'icomboquery',
							name : 'f3',
							fieldLabel:'Jenis Rekan',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							query:"SELECT PARTNERS_type_id AS id,CONCAT(partners_type_code,' - ',partners_type_name) AS text FROM inv_partners_type WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY partners_type_code ASC",
						},{
							xtype:'itextfield',
							name:'f14',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							fieldLabel:'No. PAK'
						},{
							xtype:'itextfield',
							name:'f17',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							fieldLabel:'ID Rekanan'
						},{
							xtype:'itextfield',
							name:'f4',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							fieldLabel:'PIC',
						},{
							xtype:'itextfield',
							name:'f5',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							fieldLabel:'Email'
						},{
							xtype:'itextfield',
							name:'f15',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							fieldLabel:'Telepon',
						},{
							xtype:'itextfield',
							name:'f16',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							fieldLabel:'Fax',
						},{
							xtype:'itextfield',
							name:'f6',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							fieldLabel:'Alamat',
						},{
							xtype:'idynamicoption',
							name:'f7',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							type:'DYNAMIC_COUNTRY',
							fieldLabel:'Negara'
						},{
							xtype:'idynamicoption',
							name:'f8',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							type:'DYNAMIC_PROV',
							fieldLabel:'Provinsi',
							getParent:function(){
								return Ext.getCmp('PARTNERS.input.f7').getValue();	
							}
						},{
							xtype:'idynamicoption',
							name:'f9',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							type:'DYNAMIC_CITY',
							fieldLabel:'Kota',
							getParent:function(){
								return Ext.getCmp('PARTNERS.input.f8').getValue();	
							}
						},{
							xtype:'idynamicoption',
							name:'f10',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							type:'DYNAMIC_KEC',
							fieldLabel:'Kecamatan',
							getParent:function(){
								return Ext.getCmp('PARTNERS.input.f9').getValue();	
							}
						},{
							xtype:'idynamicoption',
							name:'f11',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								}
							},
							type:'DYNAMIC_KEL',
							fieldLabel:'Kelurahan',
							getParent:function(){
								return Ext.getCmp('PARTNERS.input.f10').getValue();	
							}
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f13',
							press:{
								enter:function(){
									_click('PARTNERS.search.btnSearch');
								},
							},
							width: 200,
							fieldLabel:'Aktif'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'PARTNERS.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('PARTNERS.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('PARTNERS.dropdown').getValue()]=Ext.getCmp('PARTNERS.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=PARTNERS&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('PARTNERS_DELETE',function(){
						Ext.getCmp('PARTNERS.confirm').confirm({
							msg :"Apakah akan hapus Kode Rekan '"+a.f1+"' ?",
							allow : 'PARTNERS.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=PARTNERS&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('PARTNERS.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('PARTNERS.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('PARTNERS.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('PARTNERS.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('PARTNERS_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=PARTNERS&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('PARTNERS.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('PARTNERS.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('PARTNERS.input.panel').qReset();
									Ext.getCmp('PARTNERS.input.f1').setValue(a.f1);
									Ext.getCmp('PARTNERS.input.f2').setValue(a.f2);
									Ext.getCmp('PARTNERS.input.f3').setValue(o.f3);
									Ext.getCmp('PARTNERS.input.f4').setValue(o.f4);
									Ext.getCmp('PARTNERS.input.f5').setValue(o.f5);
									Ext.getCmp('PARTNERS.input.f6').setValue(o.f6);
									Ext.getCmp('PARTNERS.input.f7').setValue(o.f7);
									Ext.getCmp('PARTNERS.input.f8').setValue(o.f8);
									Ext.getCmp('PARTNERS.input.f9').setValue(o.f9);
									Ext.getCmp('PARTNERS.input.f10').setValue(o.f10);
									Ext.getCmp('PARTNERS.input.f11').setValue(o.f11);
									Ext.getCmp('PARTNERS.input.f13').setValue(o.f13);
									Ext.getCmp('PARTNERS.input.f14').setValue(o.f14);
									Ext.getCmp('PARTNERS.input.f15').setValue(o.f15);
									Ext.getCmp('PARTNERS.input.f16').setValue(o.f16);
									Ext.getCmp('PARTNERS.input.f17').setValue(o.f17);
									Ext.getCmp('PARTNERS.input.i').setValue(a.i);
									Ext.getCmp('PARTNERS.input.p').setValue('UPDATE');
									Ext.getCmp('PARTNERS.list').hide();
									Ext.getCmp('PARTNERS.input').show();
									Ext.getCmp('PARTNERS.input.f2').focus();
									Ext.getCmp('PARTNERS.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('PARTNERS.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('PARTNERS.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('PARTNERS.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Rekanan</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
				xtype:'iconfig',
				id:'PARTNERS.config',
				menuCode:'PARTNERS',
				code:[
					iif(_access('PARTNERS_config_SEQUENCE')==false,'SEQUENCE',null),
					iif(_access('PARTNERS_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
				]
			},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'PARTNERS.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('PARTNERS.input.panel').qReset();
						Ext.getCmp('PARTNERS.input.p').setValue('ADD');
						Ext.getCmp('PARTNERS.list').hide();
						Ext.getCmp('PARTNERS.input').show();
						if(getSetting('PARTNERS','SEQUENCE')=='Y'){
							Ext.getCmp('PARTNERS.input.f1').setReadOnly(true);
							Ext.getCmp('PARTNERS.input.f2').focus();
						}else{
							Ext.getCmp('PARTNERS.input.f1').setReadOnly(false);
							Ext.getCmp('PARTNERS.input.f1').focus();
						}
						Ext.getCmp('PARTNERS.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'PARTNERS.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'PARTNERS.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Rekan'},
								{id:'f1',text:'Kode Rekan'},
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
								{id:'f17',text:'ID Rekanan'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('PARTNERS.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'PARTNERS.text',
							press:{
								enter:function(){
									_click('PARTNERS.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'PARTNERS.btnSearch',
							handler : function(a) {
								Ext.getCmp('PARTNERS.list').refresh(false);
							}
						},{
							tooltip:'Export',
							id:'PARTNERS.btnExport',
							iconCls: 'fa fa-file-excel-o',
							handler:function(a){
								Ext.getCmp('PARTNERS.confirm').confirm({
									msg : "Apakah Akan Export Data ?",
									allow : 'PARTNERS.export',
									onY : function() {
										window.open(url+'cmd?m=PARTNERS&f=toExcel&session='+_session_id+'&'+Ext.getCmp('PARTNERS.dropdown').getValue()+'='+Ext.getCmp('PARTNERS.text').getValue());
									}
								})
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'PARTNERS.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('PARTNERS.search').show();
						Ext.getCmp('PARTNERS.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Rekan',width: 150, dataIndex: 'f1' },
				{ text: 'Nama Rekan',width:200,dataIndex: 'f2'},
				{ text: 'Jenis Rekan',width:150,dataIndex: 'f3'},
				{ text: 'Mail',width:150,dataIndex: 'f5'},
				{ text: 'Alamat',flex:true,dataIndex: 'f6'},
				{ xtype:'active',dataIndex: 'f13'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PARTNERS.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PARTNERS.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'PARTNERS.input',
			border:false,
			hidden:true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('PARTNERS.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('PARTNERS.input.btnClose');
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
					id:'PARTNERS.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('PARTNERS.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('PARTNERS.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'PARTNERS.close',
								onY : function() {
									Ext.getCmp('PARTNERS.input').hide();
									Ext.getCmp('PARTNERS.list').show();
								}
							});
						}else{
							Ext.getCmp('PARTNERS.input').hide();
							Ext.getCmp('PARTNERS.list').show();
						}
					}
				},'->','<b>Input Rekanan</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'PARTNERS.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('PARTNERS.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('PARTNERS.confirm').confirm({
								msg : 'Apakah akan menyimpan data ini?',
								allow : 'PARTNERS.save',
								onY : function() {
									var param = Ext.getCmp('PARTNERS.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=PARTNERS&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('PARTNERS.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('PARTNERS.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('PARTNERS.input.p').setValue('UPDATE');
												if(r.d.i!=''){
													Ext.getCmp('PARTNERS.input.i').setValue(r.d.i);
													Ext.getCmp('PARTNERS.input.f1').setValue(r.d.f1);
												}
												Ext.getCmp('PARTNERS.input.f1').setReadOnly(true);
												Ext.getCmp('PARTNERS.input').closing = false;
												Ext.getCmp('PARTNERS.input.f2').focus();
												Ext.getCmp('PARTNERS.input.panel').qSetForm()
												Ext.getCmp('PARTNERS.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('PARTNERS.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else if(req==true){
							Ext.getCmp('PARTNERS.input').hide();
							Ext.getCmp('PARTNERS.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					submit:'PARTNERS.input.btnSave',
					id : 'PARTNERS.input.panel',
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
									id:'PARTNERS.input.p'
								},{
									xtype:'ihiddenfield',
									name:'i',
									id:'PARTNERS.input.i'
								},{
									xtype:'itextfield',
									submit:'PARTNERS.input.panel',
									maxLength:32,
									fieldLabel:'Kode Rekan',
									name:'f1',
									readOnly:true,
									property:{
										upper:true,
										space:false
									},
									id:'PARTNERS.input.f1',
									allowBlank: false
								},{
									xtype:'itextfield',
									submit:'PARTNERS.input.panel',
									name:'f2',
									fieldLabel:'Nama Rekan',
									property:{
										dynamic:true
									},
									id:'PARTNERS.input.f2',
									allowBlank: false
								},{
									xtype:'icomboquery',
									submit:'PARTNERS.input.panel',
									id : 'PARTNERS.input.f3',
									name : 'f3',
									fieldLabel:'Jenis Rekan',
									query:"SELECT partners_type_id AS id,CONCAT(partners_type_code,' - ',partners_type_name) AS text FROM inv_partners_type WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY partners_type_code ASC",
									allowBlank : false
								},{
									xtype:'itextfield',
									submit:'PARTNERS.input.panel',
									name:'f14',
									fieldLabel:'No. PAK',
									id:'PARTNERS.input.f14',
									allowBlank: false
								},{
									xtype:'itextfield',
									submit:'PARTNERS.input.panel',
									name:'f17',
									maxLength:32,
									fieldLabel:'ID Rekanan',
									id:'PARTNERS.input.f17',
								},{
									xtype:'itextfield',
									submit:'PARTNERS.input.panel',
									name:'f4',
									fieldLabel:'PIC',
									id:'PARTNERS.input.f4',
									allowBlank: false
								},{
									xtype:'itextfield',
									submit:'PARTNERS.input.panel',
									name:'f5',
									maxLength:128,
									fieldLabel:'Email',
									id:'PARTNERS.input.f5',
									allowBlank: false
								},{
									xtype:'itextfield',
									submit:'PARTNERS.input.panel',
									name:'f15',
									maxLength:16,
									fieldLabel:'Telepon',
									id:'PARTNERS.input.f15'
								},{
									xtype:'itextfield',
									submit:'PARTNERS.input.panel',
									name:'f16',
									maxLength:16,
									fieldLabel:'Fax',
									id:'PARTNERS.input.f16'
								}
							]
						},{
							xtype:'form',
							minWidth:350,
							maxWidth: 400,
							border:false,
							columnWidth:.5,
							items:[
								{
									xtype:'itextarea',
									submit:'PARTNERS.input.panel',
									name:'f6',
									maxLength:128,
									fieldLabel:'Alamat',
									id:'PARTNERS.input.f6',
									allowBlank: false
								},{
									xtype:'idynamicoption',
									submit:'PARTNERS.input.panel',
									name:'f7',
									type:'DYNAMIC_COUNTRY',
									fieldLabel:'Negara',
									id:'PARTNERS.input.f7',
									allowBlank: false
								},{
									xtype:'idynamicoption',
									submit:'PARTNERS.input.panel',
									name:'f8',
									type:'DYNAMIC_PROV',
									fieldLabel:'Provinsi',
									id:'PARTNERS.input.f8',
									getParent:function(){
										return Ext.getCmp('PARTNERS.input.f7').getValue();	
									},
									allowBlank: false
								},{
									xtype:'idynamicoption',
									submit:'PARTNERS.input.panel',
									name:'f9',
									type:'DYNAMIC_CITY',
									fieldLabel:'Kota',
									id:'PARTNERS.input.f9',
									getParent:function(){
										return Ext.getCmp('PARTNERS.input.f8').getValue();	
									},
									allowBlank: false
								},{
									xtype:'idynamicoption',
									submit:'PARTNERS.input.panel',
									name:'f10',
									type:'DYNAMIC_KEC',
									fieldLabel:'Kecamatan',
									id:'PARTNERS.input.f10',
									getParent:function(){
										return Ext.getCmp('PARTNERS.input.f9').getValue();	
									},
									allowBlank: false
								},{
									xtype:'idynamicoption',
									submit:'PARTNERS.input.panel',
									name:'f11',
									type:'DYNAMIC_KEL',
									fieldLabel:'Kelurahan',
									id:'PARTNERS.input.f11',
									getParent:function(){
										return Ext.getCmp('PARTNERS.input.f10').getValue();	
									},
									allowBlank: false
								},{
									xtype:'icheckbox',
									submit:'PARTNERS.input.panel',
									name:'f13',
									fieldLabel:'Aktif',
									id:'PARTNERS.input.f13',
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
				if (Ext.getCmp('PARTNERS.input.panel').qGetForm() == false)
					Ext.getCmp('PARTNERS.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'PARTNERS.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'PARTNERS.confirm'}
	]
});