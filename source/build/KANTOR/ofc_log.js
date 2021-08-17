shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('OFC_LOG.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('OFC_LOG.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('OFC_LOG.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('OFC_LOG.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'OFC_LOG.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'OFC_LOG.search',
			modal:false,
			title:'Log - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('OFC_LOG.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('OFC_LOG.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('OFC_LOG.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('OFC_LOG.search.f1').focus();
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
					id:'OFC_LOG.search.btnSearch',
					handler: function() {
						Ext.getCmp('OFC_LOG.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'OFC_LOG.search.btnReset',
					handler: function() {
						Ext.getCmp('OFC_LOG.search.panel').qReset();
					}
				},{
					text:'Export',
					tooltip:'Export',
					id:'OFC_LOG.search.btnExport',
					iconCls: 'fa fa-file-excel-o',
					handler:function(a){
						Ext.getCmp('OFC_LOG.confirm').confirm({
							msg : "Apakah Akan Export Data ?",
							allow : 'OFC_LOG.export',
							onY : function() {
								window.open(url+'cmd?m=OFC_LOG&f=toExcel&session='+_session_id+serialize(Ext.getCmp('OFC_LOG.search.panel').qParams()));
							}
						})
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('OFC_LOG.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'OFC_LOG.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Log',
							press:{
								enter:function(){
									_click('OFC_LOG.search.btnSearch');
								}
							},
							id:'OFC_LOG.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('OFC_LOG.search.btnSearch');
								}
							}
						},{
							xtype:'iinput',
							label :'Tgl. Log',
							items : [
								{
									xtype:'idatefield',
									name : 'f4',
									margin:false,
									press:{
										enter:function(){
											_click('OFC_LOG.search.btnSearch');
										}
									},
									emptyText: 'Awal'
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									margin:false,
									name : 'f5',
									press:{
										enter:function(){
											_click('OFC_LOG.search.btnSearch');
										}
									},
									emptyText:'Akhir'
								}
							]
						},{
							xtype:'iselect',
							fieldLabel:'Partners',
							id:'OFC_LOG.search.f7',
							valueField:'i',
							textField:'name',
							name:'f7',
							button:{
								urlData:url + 'cmd?m=OFC_LOG&f=getListPartners',
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
										value:getSetting('OFC_LOG','DEFAULT_PARTNERS_TYPE'),
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
							xtype:'iselect',
							fieldLabel:'Karyawan',
							id:'OFC_LOG.search.f3',
							valueField:'employee_id',
							textField:'name',
							value:{employee_id:_employee_id,name:_user_name},
							name:'f3',
							button:{
								items:[
									{
										xtype:'itextfield',
										fieldLabel:'Nama',
										name:'f2',
										database:{
											table:'app_employee',
											field:'first_name',
											separator:'like'
										},
										press:{
											enter:function(){
												Ext.getCmp('OFC_LOG.search.f3').refresh();
											}
										},
										// id:'USER.input.btnShowKaryawan.f1'
									},{
										xtype:'ihiddenfield',
										name:'f6',
										database:{
											table:'app_employee',
											field:'M.tenant_id',
											type:'double',
											separator:'='
										},
										// id:'USER.input.btnShowKaryawan.f2',
										value:_tenant_id
									},{
										xtype:'ihiddenfield',
										name:'f10',
										database:{
											table:'app_employee',
											field:'M.active_flag',
											type:'active',
										},
										value:'Y'
									},{
										xtype:'itextfield',
										name:'f1',
										fieldLabel:'ID Number',
										database:{
											table:'app_employee',
											field:'id_number',
											separator:'like'
										},
										press:{
											enter:function(){
												Ext.getCmp('OFC_LOG.search.f3').refresh();
											}
										}
									},{
										xtype:'idropdown',
										name : 'f3',
										fieldLabel:'Jenis Kelamin',
										database:{
											table:'app_employee',
											field:'gender'
										},
										parameter:'GENDER',
										press:{
											enter:function(){
												Ext.getCmp('OFC_LOG.search.f3').refresh();
											}
										}
									},{
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
														Ext.getCmp('OFC_LOG.search.f3').refresh();
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
														Ext.getCmp('OFC_LOG.search.f3').refresh();
													}
												},
												emptyText:'Akhir'
											}
										]
									},{
										xtype:'itextfield',
										name:'f7',
										fieldLabel:'Pekerjaan',
										database:{
											table:'app_employee',
											field:'JOB.job_name',
											separator:'like'
										},
										press:{
											enter:function(){
												Ext.getCmp('OFC_LOG.search.f3').refresh();
											}
										}
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
												Ext.getCmp('OFC_LOG.search.f3').refresh();
											}
										}
									}
								],
								database:{
									table:'app_employee',
									inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender LEFT JOIN app_job JOB ON JOB.job_id=M.job_id'
								},
								columns:[
									{ hidden:true,dataIndex: 'employee_id',database:{field:'employee_id'} },
									{ text: 'No. ID',width: 80, dataIndex: 'id_number' ,align:'center',database:{field:'id_number'} },
									{ text: 'Nama',width: 200,dataIndex: 'name',database:{field:"CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name"} },
									{ text: 'Jenis Kelamin',width: 100,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
									{ text: 'Tanggal Lahir',width: 100,align:'center', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
									{ text: 'Pekerjaan',width: 100,dataIndex: 'job' ,database:{field:'JOB.job_name AS job'} },
									{ text: 'Alamat',width: 100,dataIndex: 'address',flex:1,database:{field:'address'}  },
								]
							}
						},{
							xtype:'idropdown',
							parameter:'LOG_STATUS',
							name : 'f6',
							press:{
								enter:function(){
									_click('OFC_LOG.search.btnSearch');
								},
							},
							width: 200,
							fieldLabel: 'Status'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'OFC_LOG.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('OFC_LOG.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('OFC_LOG.dropdown').getValue()]=Ext.getCmp('OFC_LOG.text').getValue();
					obj['f3']=_employee_id;
					return obj;
				}
			},
			url:url + 'cmd?m=OFC_LOG&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('OFC_LOG_DELETE',function(){
						Ext.getCmp('OFC_LOG.confirm').confirm({
							msg : 'Apakah akan menghapus Kode Barang '+a.f1,
							allow : 'OFC_LOG.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=OFC_LOG&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('OFC_LOG.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('OFC_LOG.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('OFC_LOG.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('OFC_LOG.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('OFC_LOG_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=OFC_LOG&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('OFC_LOG.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('OFC_LOG.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									var l=r.d.l;
									var l2=r.d.l2;
									Ext.getCmp('OFC_LOG.input.panel').qReset();
									Ext.getCmp('OFC_LOG.list').hide();
									Ext.getCmp('OFC_LOG.input').show();
									Ext.getCmp('OFC_LOG.input.f1').setValue(a.f1);
									Ext.getCmp('OFC_LOG.input.f2').setValue(o.description);
									Ext.getCmp('OFC_LOG.input.f4').setValue(o.status);
									Ext.getCmp('OFC_LOG.input.f5').setValue(o.bobot);
									if(o.partners != undefined && o.partners!=null && o.partners!==''){
										Ext.getCmp('OFC_LOG.input.f6').setValue({i:o.partners_id,name:o.partners});
									}
									var tblpic=Ext.getCmp('OFC_LOG.input.pic');
									var tbllist=Ext.getCmp('OFC_LOG.input.list');
									tblpic.resetTable();
									for(var i=0,iLen=l.length; i<iLen; i++){
										if(i!==0){
											tblpic._add();
										}
										tblpic._get('pic',i).setValue({employee_id:l[i].employee_id,name:l[i].employee});
									}
									tbllist.resetTable();
									for(var i=0,iLen=l2.length; i<iLen; i++){
										tbllist._add();
										tbllist._get('pic2',i).setValue({employee_id:l2[i].employee_id,name:l2[i].employee});
										tbllist._get('work_date',i).setValue(l2[i].work_on);
										tbllist._get('det_id',i).setValue(l2[i].log_detail_id);
										tbllist._get('percentage',i)._setValue(l2[i].percentage);
									}
									Ext.getCmp('OFC_LOG.input.i').setValue(a.i);
									Ext.getCmp('OFC_LOG.input.p').setValue('UPDATE');
									Ext.getCmp('OFC_LOG.input').setTitle('Log - Update');
									
									Ext.getCmp('OFC_LOG.input.f2').focus();
									Ext.getCmp('OFC_LOG.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('OFC_LOG.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('OFC_LOG.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('OFC_LOG.list').fn.update(a.dataRow);
				}
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},
				{
					xtype:'iconfig',
					menuCode:'OFC_LOG',
					text:iif(_mobile==true,'Config',null),
					code:[
						iif(_access('OFC_LOG_config_DEFAULT_PIC')==false,'DEFAULT_PIC',null),
						iif(_access('OFC_LOG_config_DEFAULT_STATUS')==false,'DEFAULT_STATUS',null),
						iif(_access('OFC_LOG_config_DEFAULT_PARTNERS_TYPE')==false,'DEFAULT_PARTNERS_TYPE',null),
						iif(_access('OFC_LOG_config_DEFAULT_PARTNERS')==false,'DEFAULT_PARTNERS',null),
						iif(_access('OFC_LOG_config_DEFAULT_BOBOT')==false,'DEFAULT_BOBOT',null),
						iif(_access('OFC_LOG_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('OFC_LOG_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
					]
				},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'OFC_LOG.btnAdd',
					iconCls: 'fa fa-plus',
					handler:function(a){
						Ext.Ajax.request({
							url : url + 'cmd?m=OFC_LOG&f=initAdd',
							method : 'POST',
							before:function(){
								Ext.getCmp('OFC_LOG.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('OFC_LOG.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S'){
									var table=Ext.getCmp('OFC_LOG.input.pic');
									Ext.getCmp('OFC_LOG.input.panel').qReset();
									Ext.getCmp('OFC_LOG.input.list').resetTable();
									Ext.getCmp('OFC_LOG.input.pic').resetTable();
									if(_access('OFC_LOG_input_add_pic')==true){
										table._get('pic',0).setReadOnly(true);
										table._get('del',0).disable();
										table._getAddButton().disable();
									}else{
										table._getAddButton().enable();
									}
									if(r.d.partners_id != undefined){
										Ext.getCmp('OFC_LOG.input.f6').setValue({i:r.d.partners_id,name:r.d.partners_name});
									}
									// Ext.getCmp('OFC_LOG.input.f5')._setValue(getSetting('OFC_LOG','DEFAULT_BOBOT'));
									Ext.getCmp('OFC_LOG.input.p').setValue('ADD');
									Ext.getCmp('OFC_LOG.list').hide();
									Ext.getCmp('OFC_LOG.input').show();
									Ext.getCmp('OFC_LOG.input').setTitle('Log - Tambah');
									if(getSetting('OFC_LOG','SEQUENCE')=='Y'){
										Ext.getCmp('OFC_LOG.input.f1').setReadOnly(true);
										Ext.getCmp('OFC_LOG.input.f2').focus();
									}else{
										Ext.getCmp('OFC_LOG.input.f1').setReadOnly(false);
										Ext.getCmp('OFC_LOG.input.f1').focus();
									}
									Ext.getCmp('OFC_LOG.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('OFC_LOG.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
						
					}
				},{
					xtype:'buttongroup',
					id:'OFC_LOG.group.search',
					items:[
						{
							xtype:'idropdown',
							id : 'OFC_LOG.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Deskripsi'},
								{id:'f1',text:'Kode Log'}
							],
							width: 150,
							press:{
								enter:function(){
									_click('OFC_LOG.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'OFC_LOG.text',
							press:{
								enter:function(){
									_click('OFC_LOG.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							text:iif(_mobile==true,'Cari',null),
							id:'OFC_LOG.btnSearch',
							handler : function(a) {
								Ext.getCmp('OFC_LOG.list').refresh(false);
							}
						}
					]
				},{
					text: 'Pencarian',
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'OFC_LOG.btnShowSearch',
					iconCls: 'fa fa-search',
					handler:function(a){
						if(Ext.getCmp('OFC_LOG.search.f3').getValue()==null || Ext.getCmp('OFC_LOG.search.f3').getValue()==''){
							// Ext.getCmp('OFC_LOG.search.f3').setValue({employee_id:_employee_id,name:_user_name});
						}
						Ext.getCmp('OFC_LOG.search').show();
						Ext.getCmp('OFC_LOG.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Log',width: 120,align:'center', dataIndex: 'f1' },
				{ text: 'Tgl. Log',width: 80,align:'center',dataIndex: 'f2'},
				{ text: 'Partner',width: 120,dataIndex: 'f3'},
				{ text: 'PIC',width: 150,dataIndex: 'f7'},
				{ text: 'Deskripsi',flex: true,dataIndex: 'f4' },
				{ text: 'Status',width: 80,dataIndex: 'f5' },
				{ text: 'Bobot',width: 50,dataIndex: 'f6' },
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionOFC_LOG, event, record, row) {
						Ext.getCmp('OFC_LOG.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash',
					handler: function(grid, rowIndex, colIndex, actionOFC_LOG, event, record, row) {
						Ext.getCmp('OFC_LOG.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'OFC_LOG.input',
			border:false,
			hidden:true,
			title:'Log',
			autoScroll:true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('OFC_LOG.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('OFC_LOG.input.btnClose');
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
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'OFC_LOG.input.btnSave',
					iconCls:'fa fa-save',
					handler: function() {
						var req=Ext.getCmp('OFC_LOG.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('OFC_LOG.confirm').confirm({
								msg : 'Apakah akan Simpan data ini?',
								allow : 'OFC_LOG.save',
								onY : function() {
									var param = Ext.getCmp('OFC_LOG.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=OFC_LOG&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('OFC_LOG.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('OFC_LOG.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('OFC_LOG.input').hide();
												Ext.getCmp('OFC_LOG.list').show();
												Ext.getCmp('OFC_LOG.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('OFC_LOG.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else{
							if(Ext.getCmp('OFC_LOG.input.p').getValue()=='ADD'){
								Ext.create('App.cmp.Toast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							}else{
								Ext.create('App.cmp.Toast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				},'->',{
					text:'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'OFC_LOG.input.btnClose',
					iconCls:'fa fa-arrow-right',
					handler: function() {
						var req=Ext.getCmp('OFC_LOG.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('OFC_LOG.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'OFC_LOG.close',
								onY : function() {
									Ext.getCmp('OFC_LOG.input').hide();
									Ext.getCmp('OFC_LOG.list').show();
								}
							});
						}else{
							Ext.getCmp('OFC_LOG.input').hide();
							Ext.getCmp('OFC_LOG.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'OFC_LOG.input.panel',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'OFC_LOG.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'OFC_LOG.input.i'
						},{
							xtype:'itextfield',
							maxLength:32,
							fieldLabel:'Kode Log',
							name:'f1',
							width: 200,
							readOnly:true,
							property:{
								upper:true,
								space:false
							},
							id:'OFC_LOG.input.f1',
							allowBlank: false
						},{
							xtype:'itextarea',
							name:'f2',
							fieldLabel:'Deskripsi',
							id:'OFC_LOG.input.f2',
							maxLength:256,
						},{
							xtype:'iselect',
							fieldLabel:'Rekanan',
							id:'OFC_LOG.input.f6',
							valueField:'i',
							textField:'name',
							name:'f6',
							button:{
								urlData:url + 'cmd?m=OFC_LOG&f=getListPartners',
								windowWidth: 800,
								items:[
									{
										xtype:'itextfield',
										name:'f2',
										fieldLabel:'Nama Rekanan',
									},{
										xtype:'itextfield',
										name:'f1',
										fieldLabel:'Kode Rekanan',
									},{
										xtype:'idropdown',
										name : 'f3',
										fieldLabel:'Jenis Partner',
										value:getSetting('OFC_LOG','DEFAULT_PARTNERS_TYPE'),
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
						},
						// {
							// xtype:'inumberfield',
							// name:'f5',
							// width: 150,
							// fieldLabel: 'Bobot',
							// id:'OFC_LOG.input.f5',
							// allowBlank: false,
							// value:10
						// },
						{
							xtype:'uploadbox',
							height: 100,
							listeners:{
								ddinit:function(){
									alert();
								}
							}
						},
						{
							xtype:'ilistinput',
							id:'OFC_LOG.input.pic',
							height:100,
							name:'options',
							onAddLine:function($this){
								var table=Ext.getCmp('OFC_LOG.input.pic');
								if(table != undefined){
									var defaultPic=getSetting('OFC_LOG','DEFAULT_PIC');
									if(defaultPic==''){
										defaultPic='null';
									}
									eval("defaultPic="+defaultPic+";");
									table._get('pic',table._getTotal()-1).setValue(defaultPic);
								}
							},
							items:[
								{
									xtype:'iselect',
									text:'PIC',
									allowBlank : false,
									flex:1,
									valueField:'employee_id',
									textField:'name',
									name:'pic',
									button:{
										items:[
											{
												xtype:'itextfield',
												fieldLabel:'Nama',
												name:'f2',
												database:{
													table:'app_employee',
													field:'first_name',
													separator:'like'
												},
												press:{
													enter:function(){
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												},
												// id:'USER.input.btnShowKaryawan.f1'
											},{
												xtype:'ihiddenfield',
												name:'f6',
												database:{
													table:'app_employee',
													field:'M.tenant_id',
													type:'double',
													separator:'='
												},
												// id:'USER.input.btnShowKaryawan.f2',
												value:_tenant_id
											},{
												xtype:'ihiddenfield',
												name:'f10',
												database:{
													table:'app_employee',
													field:'M.active_flag',
													type:'active',
												},
												value:'Y'
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'ID Number',
												database:{
													table:'app_employee',
													field:'id_number',
													separator:'like'
												},
												press:{
													enter:function(){
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												}
											},{
												xtype:'idropdown',
												name : 'f3',
												fieldLabel:'Jenis Kelamin',
												database:{
													table:'app_employee',
													field:'gender'
												},
												parameter:'GENDER',
												press:{
													enter:function(){
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												}
											},{
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
																Ext.getCmp('OFC_LOG.input.f3').refresh();
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
																Ext.getCmp('OFC_LOG.input.f3').refresh();
															}
														},
														emptyText:'Akhir'
													}
												]
											},{
												xtype:'itextfield',
												name:'f7',
												fieldLabel:'Pekerjaan',
												database:{
													table:'app_employee',
													field:'JOB.job_name',
													separator:'like'
												},
												press:{
													enter:function(){
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												}
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
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												}
											}
										],
										database:{
											table:'app_employee',
											inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender LEFT JOIN app_job JOB ON JOB.job_id=M.job_id'
										},
										columns:[
											{ hidden:true,dataIndex: 'employee_id',database:{field:'employee_id'} },
											{ text: 'No. ID',width: 80, dataIndex: 'id_number' ,align:'center',database:{field:'id_number'} },
											{ text: 'Nama',width: 200,dataIndex: 'name',database:{field:"CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name"} },
											{ text: 'Jenis Kelamin',width: 100,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
											{ text: 'Tanggal Lahir',width: 100,align:'center', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
											{ text: 'Pekerjaan',width: 100,dataIndex: 'job' ,database:{field:'JOB.job_name AS job'} },
											{ text: 'Alamat',width: 100,dataIndex: 'address',flex:1,database:{field:'address'}  },
										]
									}
								}
							]
						},{
							xtype:'ilistinput',
							id:'OFC_LOG.input.list',
							height:200,
							addLine:false,
							name:'work',
							onAddLine:function($this){
								var table=Ext.getCmp('OFC_LOG.input.list');
								if(table != undefined){
									table._get('pic2',table._getTotal()-1).setValue({employee_id:_employee_id,name:_user_name});
								}
							},
							items:[
								{
									xtype:'ihiddenfield',
									name:'det_id'
								},{
									xtype:'idatefield',
									name:'work_date',
									text:'Tanggal',
									value:new Date(),
									emptyText:'Tanggal',
									allowBlank: false,
									width: 100,
								},{
									xtype:'inumberfield',
									name:'percentage',
									text:'Bobot',
									allowBlank: false,
									emptyText:'Frac',
									minValue:0,
									maxValue:100,
									app:{decimal:2},
									value:1,
									width: 40,
								},{
									xtype:'iselect',
									text:'PIC',
									allowBlank : false,
									flex:1,
									readOnly:true,
									valueField:'employee_id',
									textField:'name',
									name:'pic2',
									button:{
										items:[
											{
												xtype:'itextfield',
												fieldLabel:'Nama',
												name:'f2',
												database:{
													table:'app_employee',
													field:'first_name',
													separator:'like'
												},
												press:{
													enter:function(){
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												},
												// id:'USER.input.btnShowKaryawan.f1'
											},{
												xtype:'ihiddenfield',
												name:'f6',
												database:{
													table:'app_employee',
													field:'M.tenant_id',
													type:'double',
													separator:'='
												},
												// id:'USER.input.btnShowKaryawan.f2',
												value:_tenant_id
											},{
												xtype:'ihiddenfield',
												name:'f10',
												database:{
													table:'app_employee',
													field:'M.active_flag',
													type:'active',
												},
												value:'Y'
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'ID Number',
												database:{
													table:'app_employee',
													field:'id_number',
													separator:'like'
												},
												press:{
													enter:function(){
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												}
											},{
												xtype:'idropdown',
												name : 'f3',
												fieldLabel:'Jenis Kelamin',
												database:{
													table:'app_employee',
													field:'gender'
												},
												parameter:'GENDER',
												press:{
													enter:function(){
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												}
											},{
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
																Ext.getCmp('OFC_LOG.input.f3').refresh();
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
																Ext.getCmp('OFC_LOG.input.f3').refresh();
															}
														},
														emptyText:'Akhir'
													}
												]
											},{
												xtype:'itextfield',
												name:'f7',
												fieldLabel:'Pekerjaan',
												database:{
													table:'app_employee',
													field:'JOB.job_name',
													separator:'like'
												},
												press:{
													enter:function(){
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												}
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
														Ext.getCmp('OFC_LOG.input.f3').refresh();
													}
												}
											}
										],
										database:{
											table:'app_employee',
											inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender LEFT JOIN app_job JOB ON JOB.job_id=M.job_id'
										},
										columns:[
											{ hidden:true,dataIndex: 'employee_id',database:{field:'employee_id'} },
											{ text: 'No. ID',width: 80, dataIndex: 'id_number' ,align:'center',database:{field:'id_number'} },
											{ text: 'Nama',width: 200,dataIndex: 'name',database:{field:"CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name"} },
											{ text: 'Jenis Kelamin',width: 100,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
											{ text: 'Tanggal Lahir',width: 100,align:'center', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
											{ text: 'Pekerjaan',width: 100,dataIndex: 'job' ,database:{field:'JOB.job_name AS job'} },
											{ text: 'Alamat',width: 100,dataIndex: 'address',flex:1,database:{field:'address'}  },
										]
									}
								}
							]
						}
					]
				}
			],
		},{xtype:'iconfirm',id : 'OFC_LOG.confirm'}
	]
});