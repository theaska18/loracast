/*
	import PARAMETER.iparameter
	import cmp.ifotoupload
	import cmp.ilistinput
	import cmp.icomboquery
	import cmp.iconfig
	import cmp.iinput
	import cmp.idatefield
	import cmp.itextarea
	import cmp.ipanel
	import cmp.idynamicoption
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('EMPLOYEE.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('EMPLOYEE.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('EMPLOYEE.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('EMPLOYEE.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'EMPLOYEE.main',
	layout:'fit',
	border:false,
	paddingBottom:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'EMPLOYEE.search',
			modal:false,
			title:'Karyawan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('EMPLOYEE.search.btnClose');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('EMPLOYEE.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('EMPLOYEE.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('EMPLOYEE.search.f1').focus();
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
					id:'EMPLOYEE.search.btnSearch',
					handler: function() {
						Ext.getCmp('EMPLOYEE.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'EMPLOYEE.search.btnReset',
					handler: function() {
						Ext.getCmp('EMPLOYEE.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					id:'RS_RJ_PASIEN.search.btnClose',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('EMPLOYEE.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'EMPLOYEE.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Nomor ID',
							database:{
								table:'app_employee',
								field:'id_number',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('EMPLOYEE.search.btnSearch');
								}
							},
							id:'EMPLOYEE.search.f1'
						},{
							xtype:'icomboquery',
							name:'f9',
							fieldLabel:'Penyewa',
							query:'SELECT tenant_id AS id, tenant_name as text FROM app_tenant ORDER BY tenant_name ASC',
							id:'EMPLOYEE.search.f9',
							database:{
								table:'app_employee',
								field:'M.tenant_id',
								separator:'='
							},
							press:{
								enter:function(){
									_click('EMPLOYEE.search.btnSearch');
								}
							},
						},{
							xtype:'itextfield',
							fieldLabel:'Nama Karyawan',
							name:'f2',
							database:{
								table:'app_employee',
								field:'first_name',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('EMPLOYEE.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							name : 'f3',
							fieldLabel:'Jenis Kelamin',
							database:{
								table:'app_employee',
								field:'gender'
							},
							parameter:'GENDER',
							press:{
								enter:function(){
									_click('EMPLOYEE.search.btnSearch');
								}
							}
						}, {
							xtype:'iinput',
							label :'Tgl. Lahir',
							items : [
								{
									xtype:'idatefield',
									name : 'f4',
									margin:false,
									database:{
										table:'app_employee',
										field:'birth_date',
										separator:'>='
									},
									press:{
										enter:function(){
											_click('EMPLOYEE.search.btnSearch');
										}
									},
									emptyText: 'Awal'
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									margin:false,
									database:{
										table:'app_employee',
										field:'M.birth_date',
										separator:'<='
									},
									name : 'f5',
									press:{
										enter:function(){
											_click('EMPLOYEE.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'itextfield',
							name:'f8',
							fieldLabel:'Alamat',
							database:{
								table:'app_employee',
								field:'address',
								separator:'like'
							},
							press:{
								enter:function(){
									_click('EMPLOYEE.search.btnSearch');
								}
							},
							id:'EMPLOYEE.search.f8'
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							database:{
								table:'app_employee',
								field:'M.active_flag',
								type:'active'
							},
							name : 'f6',
							width:200,
							press:{
								enter:function(){
									_click('EMPLOYEE.search.btnSearch');
								}
							},
							fieldLabel: 'Aktif'
						}
					]
				}
			]
		},{
			xtype:'itablegrid',
			id:'EMPLOYEE.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('EMPLOYEE.search.panel')._parameter();
				}else{
					var obj={};
					obj['app_employee']={};
					obj['app_employee'][Ext.getCmp('EMPLOYEE.dropdown').getValue()]={
						value:Ext.getCmp('EMPLOYEE.text').getValue(),
						separator:'like'
					};
					obj['app_employee']['M.active_flag']={
						value:true,
						type:'boolean',
						separator:'='
					}
					obj['app_employee']['M.tenant_id']={
						value:_tenant_id,
						type:'double',
						separator:'='
					}
					return JSON.stringify(obj);
				}
			},
			database:{
				table:'app_employee',
				inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender '
			},
			fn:{
				delete:function(a){
					_access('EMPLOYEE_delete',function(){
						Ext.getCmp('EMPLOYEE.confirm').confirm({
							msg : "Apakah Akan Menghapus Data No. Identitas '"+a.id_number+"' ?",
							allow : 'EMPLOYEE.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=EMPLOYEE&f=delete',
									method : 'POST',
									params : {
										i : a.employee_id
									},
									before:function(){
										Ext.getCmp('EMPLOYEE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('EMPLOYEE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											// socket.send('USERMODULE','EMPLOYEE','DELETE');
											Ext.getCmp('EMPLOYEE.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('EMPLOYEE.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					Ext.getCmp('EMPLOYEE.input.tableOption').resetTable();
					Ext.getCmp('EMPLOYEE.input.tableOption')._add();
					_access('EMPLOYEE_update',function(){
						Ext.getCmp('EMPLOYEE.list').hide();
						// Ext.getCmp('EMPLOYEE.input').setTitle('Karyawan - Edit');
						Ext.getCmp('EMPLOYEE.input').show();
						Ext.getCmp('EMPLOYEE.input.i').setValue(a.employee_id);
						Ext.getCmp('EMPLOYEE.input.p').setValue('UPDATE');
						Ext.getCmp('EMPLOYEE.input.f18').setReadOnly(true);
						Ext.getCmp('EMPLOYEE.input.panel')._load(function(){
							Ext.getCmp('EMPLOYEE.input.f1').setReadOnly(false);
						},null,function(data){
							Ext.getCmp('EMPLOYEE.input.f15').initial=data.app_employee.first_name+' '+data.app_employee.second_name+' '+data.app_employee.last_name;
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('EMPLOYEE.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('EMPLOYEE.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Karyawan</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'EMPLOYEE.config',
					menuCode:'EMPLOYEE',
					code:[
						iif(_access('EMPLOYEE_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('EMPLOYEE_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
					]
				},'->',
				{
					text:'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'EMPLOYEE.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('EMPLOYEE.list').hide();
						Ext.getCmp('EMPLOYEE.input').show();
						Ext.getCmp('EMPLOYEE.input.panel').qReset();
						Ext.getCmp('EMPLOYEE.input.tableOption').setVal([]);
						Ext.getCmp('EMPLOYEE.input.f15').initial='X X';
						Ext.getCmp('EMPLOYEE.input.f18').setValue(_tenant_id.toString());
						Ext.getCmp('EMPLOYEE.input.f15').setNull();
						Ext.getCmp('EMPLOYEE.input.f19').setNull();
						Ext.getCmp('EMPLOYEE.input.f18').setReadOnly(false);
						Ext.getCmp('EMPLOYEE.input.p').setValue('ADD');
						if(getSetting('EMPLOYEE','SEQUENCE')=='Y'){
							Ext.getCmp('EMPLOYEE.input.f1').setReadOnly(true);
							Ext.getCmp('EMPLOYEE.input.f1').database.sequence=getSetting('EMPLOYEE','SEQUENCE_CODE');
							Ext.getCmp('EMPLOYEE.input.f2').focus();
						}else{
							Ext.getCmp('EMPLOYEE.input.f1').setReadOnly(false);
							Ext.getCmp('EMPLOYEE.input.f1').database.sequence='';
							Ext.getCmp('EMPLOYEE.input.f1').focus();
						}
						Ext.getCmp('EMPLOYEE.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'EMPLOYEE.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'EMPLOYEE.dropdown',
							emptyText:'Searching',
							margin:false,
							value:'first_name',
							data:[
								{id:'id_number',text:'Nomor ID'},
								{id:'first_name',text:'Nama'},
								{id:'address',text:'Alamat'}
							],
							width: 150,
							press:{
								enter:function(){
									_click('EMPLOYEE.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'EMPLOYEE.text',
							press:{
								enter:function(){
									_click('EMPLOYEE.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'EMPLOYEE.btnSearch',
							handler : function(a) {
								Ext.getCmp('EMPLOYEE.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'EMPLOYEE.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						if(Ext.getCmp('EMPLOYEE.search.f9').getValue()==null || Ext.getCmp('EMPLOYEE.search.f9').getValue()==''){
							Ext.getCmp('EMPLOYEE.search.f9').setValue(_tenant_id.toString());
						}
						Ext.getCmp('EMPLOYEE.search').show();
						Ext.getCmp('EMPLOYEE.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'employee_id',database:{field:'M.employee_id'} },
				{ text: 'No. ID',width: 120, dataIndex: 'id_number',database:{field:'id_number'} },
				{ text: 'Nama',width: 200,dataIndex: 'name',database:{field:"full_name AS name"},},
				{ text: 'Jenis Kelamin',width: 120,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
				{ text: 'Tanggal Lahir',xtype:'date', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
				{ text: 'Alamat',flex:1,sortable:false, minWidth: 200,dataIndex: 'address',database:{field:'address'}  },
				{ xtype:'active',dataIndex: 'active_flag',align:'center',database:{field:'M.active_flag'} 
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('EMPLOYEE.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('EMPLOYEE.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'EMPLOYEE.input',
			// title:'Karyawan',
			hidden:true,
			border:false,
			layout:'fit',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('EMPLOYEE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('EMPLOYEE.input.btnClose');
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
					id:'EMPLOYEE.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('EMPLOYEE.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('EMPLOYEE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'EMPLOYEE.close',
								onY : function() {
									Ext.getCmp('EMPLOYEE.input').hide();
									Ext.getCmp('EMPLOYEE.list').show();
								}
							});
						}else{
							Ext.getCmp('EMPLOYEE.input').hide();
							Ext.getCmp('EMPLOYEE.list').show();
						}
					}
				},'->','<b>Karyawan</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'EMPLOYEE.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('EMPLOYEE.input.panel').qGetForm(true);
						if(req == false){
							var name=Ext.getCmp('EMPLOYEE.input.f2').getValue();
							if(Ext.getCmp('EMPLOYEE.input.f3').getValue().trim()!=''){
								name+=' '+Ext.getCmp('EMPLOYEE.input.f3').getValue().trim();
							}
							if(Ext.getCmp('EMPLOYEE.input.f4').getValue().trim()!=''){
								name+=' '+Ext.getCmp('EMPLOYEE.input.f4').getValue().trim();
							}
							Ext.getCmp('EMPLOYEE.input.f20').setValue(name);
							Ext.getCmp('EMPLOYEE.input.panel')._save(function(){
								Ext.getCmp('EMPLOYEE.input').hide();
								Ext.getCmp('EMPLOYEE.list').show();
								Ext.getCmp('EMPLOYEE.list').refresh();
							});
						}else{
							if(Ext.getCmp('EMPLOYEE.input.p').getValue()=='ADD'){
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
					layout:'column',
					id : 'EMPLOYEE.input.panel',
					submit:'EMPLOYEE.input.btnSave',
					database:{
						command:{
							app_employee:{
								primary:'employee_id',
								unique:[{field:'tenant_id',type:'double'},{field:'id_number',name:'ID Number'}]
							},
							app_employee_structure:{
								primary:'employee_structure_id',
								unique:[{field:'structure_id',name:'Struktur'},{field:'employee_id',name:'Karyawan'}],
								parent:{
									field:'employee_id',
									value:{
										table:'app_employee',
										field:'employee_id'
									}
								}
							}
						}
					},
					items:[
						{
							xtype:'form',
							columnWidth: .33,
							cls:'i-transparent',
							border:false,
							minWidth:345,
							items:[
								{
									xtype:'ihiddenfield',
									name:'p',
									id:'EMPLOYEE.input.p'
								},{
									xtype:'ihiddenfield',
									name:'i',
									id:'EMPLOYEE.input.i',
									database:{
										table:'app_employee',
										field:'employee_id',
										type:'double'
									}
								},{
									xtype:'ihiddenfield',
									name:'f20',
									id:'EMPLOYEE.input.f20',
									database:{
										table:'app_employee',
										field:'full_name',
									}
								},{
									xtype:'itextfield',
									submit:'EMPLOYEE.input.panel',
									maxLength:32,
									fieldLabel:'No. Identitas',
									database:{
										table:'app_employee',
										field:'id_number',
										sequence:''
									},
									name:'f1',
									id:'EMPLOYEE.input.f1',
									submit:'EMPLOYEE.input.panel',
									allowBlank: false,
									property:{
										upper:true,
										space:false
									}
								},{
									xtype:'icomboquery',
									fieldLabel:'Penyewa',
									submit:'EMPLOYEE.input.panel',
									database:{
										table:'app_employee',
										field:'tenant_id'
									},
									name:'f18',
									id:'EMPLOYEE.input.f18',
									query:'SELECT tenant_id AS id, tenant_name as text FROM app_tenant ORDER BY tenant_name ASC',
									allowBlank: false,
									listeners:{
										select:function(a){
											Ext.getCmp('EMPLOYEE.input.f16').setValue(null);
											Ext.getCmp('EMPLOYEE.input.f16').load("SELECT job_id AS id,CONCAT(job_code,' - ',job_name) AS text FROM app_job WHERE active_flag=true AND tenant_id="+a.getValue()+" ORDER BY job_name ASC");
										}
									}
								},{
									xtype:'itextfield',
									name:'f2',
									submit:'EMPLOYEE.input.panel',
									fieldLabel:'Nama Awal',
									database:{
										table:'app_employee',
										field:'first_name'
									},
									id:'EMPLOYEE.input.f2',
									allowBlank: false,
									property:{
										dynamic:true
									}
								},{
									xtype:'itextfield',
									name:'f3',
									fieldLabel:'Nama Kedua',
									submit:'EMPLOYEE.input.panel',
									database:{
										table:'app_employee',
										field:'second_name'
									},
									id:'EMPLOYEE.input.f3',
									allowBlank: true,
									property:{
										dynamic:true
									}
								},{
									xtype:'itextfield',
									name:'f4',
									fieldLabel:'Nama Akhir',
									submit:'EMPLOYEE.input.panel',
									database:{
										table:'app_employee',
										field:'last_name'
									},
									id:'EMPLOYEE.input.f4',
									allowBlank: true,
									property:{
										dynamic:true
									}
								},{
									xtype:'iparameter',
									id : 'EMPLOYEE.input.f5',
									fieldLabel:'Jenis Kelamin',
									submit:'EMPLOYEE.input.panel',
									name : 'f5',
									parameter:'GENDER',
									database:{
										table:'app_employee',
										field:'gender'
									},
									allowBlank : false
								},{
									xtype:'iparameter',
									id : 'EMPLOYEE.input.f6',
									submit:'EMPLOYEE.input.panel',
									fieldLabel:'Agama',
									parameter:'RELIGION',
									database:{
										table:'app_employee',
										field:'religion'
									},
									name : 'f6',
									allowBlank : false
								},{
									xtype:'idynamicoption',
									name:'f7',
									type:'DYNAMIC_CITY',
									submit:'EMPLOYEE.input.panel',
									id:'EMPLOYEE.input.f7',
									database:{
										table:'app_employee',
										field:'birth_place',
										option:'DYNAMIC_CITY'
									},
									fieldLabel:'Tempat Lahir',
									allowBlank : false
								},{
									xtype:'idatefield',
									name:'f8',
									fieldLabel:'Tanggal Lahir',
									database:{
										table:'app_employee',
										field:'birth_date',
										type:'datetime'
									},
									submit:'EMPLOYEE.input.panel',
									id:'EMPLOYEE.input.f8',
									allowBlank: false
								},{
									xtype:'itextarea',
									name:'f9',
									fieldLabel:'Alamat',
									submit:'EMPLOYEE.input.panel',
									database:{
										table:'app_employee',
										field:'address'
									},
									maxLength:256,
									id:'EMPLOYEE.input.f9'
								},{
									xtype:'icheckbox',
									name:'f17',
									fieldLabel:'Aktif',
									submit:'EMPLOYEE.input.panel',
									checked:true,
									database:{
										table:'app_employee',
										field:'active_flag',
										type:'boolean'
									},
									id:'EMPLOYEE.input.f17'
								}
							]
						},{
							xtype:'form',
							columnWidth: .33,
							cls:'i-transparent',
							minWidth:345,
							border:false,
							items:[
								{
									xtype:'itextfield',
									name:'f10',
									fieldLabel:'Alamat Email',
									vtype:'email',
									submit:'EMPLOYEE.input.panel',
									database:{
										table:'app_employee',
										field:'email_address'
									},
									id:'EMPLOYEE.input.f10',
									allowBlank: false
								},{
									xtype:'itextfield',
									name:'f11',
									maxLength:16,
									fieldLabel:'No. Telepon 1',
									submit:'EMPLOYEE.input.panel',
									database:{
										table:'app_employee',
										field:'phone_number1'
									},
									id:'EMPLOYEE.input.f11'
								},{
									xtype:'itextfield',
									name:'f12',
									fieldLabel:'No. Telepon 2',
									submit:'EMPLOYEE.input.panel',
									maxLength:16,
									database:{
										table:'app_employee',
										field:'phone_number2'
									},
									id:'EMPLOYEE.input.f12'
								},{
									xtype:'itextfield',
									name:'f13',
									fieldLabel:'No. Fax 1',
									submit:'EMPLOYEE.input.panel',
									maxLength:16,
									database:{
										table:'app_employee',
										field:'fax_number1'
									},
									id:'EMPLOYEE.input.f13'
								},{
									xtype:'itextfield',
									name:'f14',
									fieldLabel:'No. Fax 2',
									submit:'EMPLOYEE.input.panel',
									maxLength:16,
									database:{
										table:'app_employee',
										field:'fax_number2'
									},
									id:'EMPLOYEE.input.f14'
								},{
									layout:'column',
									border:false,
									items:[
										{
											columnWidth:.5,
											xtype:'form',
											border:false,
											padding:true,
											items:[
												{
													xtype:'iinput',
													label:'Foto :',
													separator:'',
													items:[]
												},{
													xtype:'ifotoupload',
													name: 'f15',
													face:true,
													database:{
														table:'app_employee',
														field:'foto'
													},
													id:'EMPLOYEE.input.f15'
												}
											]
										},{
											columnWidth:.5,
											xtype:'form',
											border:false,
											padding:true,
											items:[
												{
													xtype:'iinput',
													label:'KTP :',
													separator:'',
													items:[]
												},{
													xtype:'ifotoupload',
													name: 'f19',
													database:{
														table:'app_employee',
														field:'foto_ktp'
													},
													id:'EMPLOYEE.input.f19'
												}
											]
										}
									]
								}			
							]
						},{
							xtype:'fieldset',
							title:'Organisasi',
							id:'EMPLOYEE.input.org',
							columnWidth: .34,
							minWidth:345,
							margin:true,
							items:[
								{
									xtype:'ilistinput',
									id:'EMPLOYEE.input.tableOption',
									height:300,
									anchor:'100%',
									addLine:false,
									database:{
										table:'app_employee_structure'
									},
									name:'options',
									items:[
										{
											xtype:'ihiddenfield',
											name : 'employee_structure_id',
											database:{
												table:'app_employee_structure',
												field:'employee_structure_id',
												type:'double'
											},
											query:"SELECT structure_id AS id,CONCAT(structure_name,' - ',structure_code) AS text FROM org_structure WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY structure_name ASC"
										},{
											xtype:'icomboquery',
											text:'Struktur',
											submit:'EMPLOYEE.input.panel',
											width: 180,
											allowBlank: false,
											name : 'structure_id',
											database:{
												table:'app_employee_structure',
												field:'structure_id',
												type:'double'
											},
											query:"SELECT structure_id AS id,CONCAT(structure_name,' - ',structure_code) AS text FROM org_structure WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY structure_name ASC"
										},{
											xtype:'icomboquery',
											text:'Pekerjaan',
											flex:1,
											allowBlank: false,
											submit:'EMPLOYEE.input.panel',
											name : 'job_id',
											database:{
												table:'app_employee_structure',
												field:'job_id',
												type:'double'
											},
											query:"SELECT job_id AS id,CONCAT(job_name,' - ',job_code) AS text FROM app_job WHERE active_flag=true AND tenant_id="+_tenant_id+" ORDER BY job_name ASC"
										}
									]
								}
							]
						}
					]
				}
			]
		}, {xtype:'iconfirm', id: 'EMPLOYEE.confirm'}
	]
});