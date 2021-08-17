shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('KOPERASI_LIST.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('KOPERASI_LIST.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('KOPERASI_LIST.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('KOPERASI_LIST.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	xtype:'panel',
	id : 'KOPERASI_LIST.main',
	border:false,
	layout:'fit',
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'KOPERASI_LIST.search',
			modal:false,
			title:'Penjualan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('KOPERASI_LIST.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('KOPERASI_LIST.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('KOPERASI_LIST.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('KOPERASI_LIST.search.f1').focus();
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
					id:'KOPERASI_LIST.search.btnSearch',
					handler: function() {
						Ext.getCmp('KOPERASI_LIST.list').refresh(true);
					}
				},{
					text:'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'KOPERASI_LIST.search.btnReset',
					handler: function() {
						Ext.getCmp('KOPERASI_LIST.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('KOPERASI_LIST.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'KOPERASI_LIST.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'No. Penjualan',
							press:{
								enter:function(){
									_click('KOPERASI_LIST.search.btnSearch');
								}
							},
							id:'KOPERASI_LIST.search.f1'
						},{
							xtype:'iinput',
							label : 'Tgl. Jual',
							items : [
								 {
									xtype:'idatefield',
									name : 'f2',
									margin:false,
									press:{
										enter:function(){
											_click('KOPERASI_LIST.search.btnSearch');
										}
									},
									emptyText: 'Awal'
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									margin:false,
									name : 'f3',
									press:{
										enter:function(){
											_click('KOPERASI_LIST.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'iselect',
							fieldLabel:'Karyawan',
							id:'KOPERASI_LIST.search.f4',
							valueField:'employee_id',
							textField:'name',
							value:{employee_id:_employee_id,name:_user_name},
							name:'f4',
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
												Ext.getCmp('KOPERASI_LIST.search.f3').refresh();
											}
										},
									},{
										xtype:'ihiddenfield',
										name:'f6',
										database:{
											table:'app_employee',
											field:'M.tenant_id',
											type:'double',
											separator:'='
										},
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
												Ext.getCmp('KOPERASI_LIST.search.f3').refresh();
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
												Ext.getCmp('KOPERASI_LIST.search.f3').refresh();
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
														Ext.getCmp('KOPERASI_LIST.search.f3').refresh();
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
														Ext.getCmp('KOPERASI_LIST.search.f3').refresh();
													}
												},
												emptyText:'Akhir'
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
												Ext.getCmp('KOPERASI_LIST.search.f3').refresh();
											}
										}
									}
								],
								database:{
									table:'app_employee',
									inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender '
								},
								columns:[
									{ hidden:true,dataIndex: 'employee_id',database:{field:'employee_id'} },
									{ text: 'No. ID',width: 80, dataIndex: 'id_number' ,align:'center',database:{field:'id_number'} },
									{ text: 'Nama',width: 200,dataIndex: 'name',database:{field:"CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name"} },
									{ text: 'Jenis Kelamin',width: 100,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
									{ text: 'Tanggal Lahir',width: 100,align:'center', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
									{ text: 'Alamat',width: 100,dataIndex: 'address',flex:1,database:{field:'address'}  },
								]
							}
						},{ 
							xtype:'idropdown',
							id : 'KOPERASI_LIST.search.f9',
							parameter:'ACTIVE_FLAG',
							name : 'f9',
							width: 200,
							press:{
								enter:function(){
									_click('KOPERASI_LIST.search.btnSearch');
								},
							},
							fieldLabel:'Lunas'
						},{ 
							xtype:'idropdown',
							id : 'KOPERASI_LIST.search.f8',
							parameter:'ACTIVE_FLAG',
							name : 'f8',
							width: 200,
							press:{
								enter:function(){
									_click('KOPERASI_LIST.search.btnSearch');
								},
							},
							fieldLabel:'Posting'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'KOPERASI_LIST.list',
			params:function(bo){
				if(bo==true){
					var arr=Ext.getCmp('KOPERASI_LIST.search.panel').qParams();
					// arr['unit_id']=getSetting('KOPERASI_LIST','UNIT_ID');
					return arr;
				}else{
					var obj={};
					obj[Ext.getCmp('KOPERASI_LIST.dropdown').getValue()]=Ext.getCmp('KOPERASI_LIST.text').getValue();
					// obj['unit_id']=getSetting('KOPERASI_LIST','UNIT_ID');
					obj['f4']=_employee_id;
					return obj;
				}
			},
			url:url + 'cmd?m=KOPERASI_LIST&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('KOPERASI_LIST_DELETE',function(){
						Ext.getCmp('KOPERASI_LIST.confirm').confirm({
							msg : "Apakah akan menghapus No. Penjualan '"+a.f1+"'",
							allow : 'KOPERASI_LIST.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=KOPERASI_LIST&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('KOPERASI_LIST.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('KOPERASI_LIST.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('KOPERASI_LIST.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('KOPERASI_LIST.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('KOPERASI_LIST_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=KOPERASI_LIST&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('KOPERASI_LIST.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('KOPERASI_LIST.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o,l=r.d.l,table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
									Ext.getCmp('KOPERASI_LIST.input.panel').qReset();
									table.resetTable();
									table.loadQuery=false;
									for(var i=0, iLen=l.length; i<iLen;i++){
										var obj=l[i];
										if(i!==0){
											table._add();
										}
										table._get('id',i).setValue(obj.sell_emp_id);
										table._get('barang',i).setValue({i:obj.item_id,name:obj.item_name});
										table._get('fraction',i).setValue(obj.fraction);
										table._get('qty',i)._setValue(obj.qty);
										table._get('qty_sisa',i)._setValue(obj.qty_sisa);
										table._get('sat_kecil',i).setValue(obj.measurement_name);
										table._get('sat_kecil_id',i).setValue(obj.measurement_id);
										table._get('gin',i).setValue(obj.gin_code);
										table._get('gin_id',i).setValue(obj.gin_id);
										table._get('harga',i)._setValue(obj.price);
										table.countLine(i);
										if(o.posted ==1){
											table._get('barang',i).setReadOnly(true);
											table._get('qty',i).setReadOnly(true);
											table._get('harga',i).setReadOnly(true);
											table._get('del',i).disable();
											table._getAddButton().disable();
										}
									}
									table.loadQuery=true;
									Ext.getCmp('KOPERASI_LIST.input.i').setValue(a.i);
									Ext.getCmp('KOPERASI_LIST.input.f1').setValue(a.f1);
									Ext.getCmp('KOPERASI_LIST.input.f2').setValue(a.f2);
									Ext.getCmp('KOPERASI_LIST.input.f3').setValue({employee_id:o.employee_id,name:o.employee});
									// Ext.getCmp('KOPERASI_LIST.input.f9').setValue(o.status);
									if(o.posted ==0){
										Ext.getCmp('KOPERASI_LIST.input.payment').hide();
										// Ext.getCmp('KOPERASI_LIST.input.btnSave').enable();
										Ext.getCmp('KOPERASI_LIST.input.btnPosting').setIconCls('fa fa-check');
										Ext.getCmp('KOPERASI_LIST.input.btnPosting').setText('Posting');
										Ext.getCmp('KOPERASI_LIST.input.f2').setReadOnly(false);
										Ext.getCmp('KOPERASI_LIST.input.f3').setReadOnly(false);
									}else{
										Ext.getCmp('KOPERASI_LIST.input.payment').show();
										// Ext.getCmp('KOPERASI_LIST.input.btnSave').disable();
										Ext.getCmp('KOPERASI_LIST.input.btnPosting').setIconCls('fa fa-close');
										Ext.getCmp('KOPERASI_LIST.input.btnPosting').setText('Unposting');
										Ext.getCmp('KOPERASI_LIST.input.f2').setReadOnly(true);
										Ext.getCmp('KOPERASI_LIST.input.f3').setReadOnly(true);
									}
									table.count();
									Ext.getCmp('KOPERASI_LIST.input').closing = false;
									Ext.getCmp('KOPERASI_LIST.list').hide();
									Ext.getCmp('KOPERASI_LIST.input').show();
									Ext.getCmp('KOPERASI_LIST.input').setTitle('Penjualan Partner');
									Ext.getCmp('KOPERASI_LIST.input.payment').clear();
									if(o.payment_id != null){
										Ext.getCmp('KOPERASI_LIST.input.payment').payment_id=o.payment_id;
										Ext.getCmp('KOPERASI_LIST.input.payment').refresh();
									}
									Ext.getCmp('KOPERASI_LIST.input.f2').focus();
									Ext.getCmp('KOPERASI_LIST.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('KOPERASI_LIST.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('KOPERASI_LIST.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('KOPERASI_LIST.list').fn.update(a.dataRow);
				}
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},
				{
					xtype:'iconfig',
					id:'KOPERASI_LIST.config',
					code:[
						iif(_access('KOPERASI_LIST_config_UNIT_ID')==false,'UNIT_ID',null)
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'KOPERASI_LIST.btnAdd',
					iconCls: 'fa fa-plus',
					handler:function(a){
						var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
						table._getAddButton().enable();
						// Ext.getCmp('KOPERASI_LIST.input.btnSave').enable();
						Ext.getCmp('KOPERASI_LIST.input.panel').qReset();
						table.resetTable();
						Ext.getCmp('KOPERASI_LIST.input').closing = false;
						var defaultPic=getSetting('KOPERASI_LIST','DEFAULT_EMPLOYEE');
						if(defaultPic==''){
							defaultPic='null';
						}
						eval("defaultPic="+defaultPic+";");
						Ext.getCmp('KOPERASI_LIST.input.f3').setValue(defaultPic);
						Ext.getCmp('KOPERASI_LIST.input.btnPosting').setIconCls('fa fa-check');
						Ext.getCmp('KOPERASI_LIST.input.btnPosting').setText('Posting');
						Ext.getCmp('KOPERASI_LIST.input.f2').setReadOnly(false);
						Ext.getCmp('KOPERASI_LIST.input.f3').setReadOnly(false);
						Ext.getCmp('KOPERASI_LIST.input.payment').hide();
						Ext.getCmp('KOPERASI_LIST.list').hide();
						Ext.getCmp('KOPERASI_LIST.input').show();
						Ext.getCmp('KOPERASI_LIST.input').setTitle('Penjualan');
						Ext.getCmp('KOPERASI_LIST.input.payment').clear();
						Ext.getCmp('KOPERASI_LIST.input.f2').focus();
						Ext.getCmp('KOPERASI_LIST.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'KOPERASI_LIST.group.search',
					items:[
						{
							xtype:'idropdown',
							id : 'KOPERASI_LIST.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f1',
							data:[
								{id:'f1',text:'No. Penjualan'},
								{id:'f6',text:'Nama Karyawan'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('KOPERASI_LIST.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'KOPERASI_LIST.text',
							press:{
								enter:function(){
									_click('KOPERASI_LIST.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'KOPERASI_LIST.btnSearch',
							handler : function(a) {
								Ext.getCmp('KOPERASI_LIST.list').refresh(false);
							}
						}
					]
				},{
					text: 'Pencarian',
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'KOPERASI_LIST.btnShowSearch',
					iconCls: 'fa fa-search',
					handler:function(a){
						Ext.getCmp('KOPERASI_LIST.search').show();
						Ext.getCmp('KOPERASI_LIST.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text:'No. Penjualan',width: 120,align:'center', dataIndex: 'f1' },
				{ text: 'Tgl. Jual',width: 100,align:'center',dataIndex: 'f2'},
				{ text: 'Nama Karyawan',flex: 1,dataIndex: 'f4' },
				{ text: 'Jumlah',dataIndex: 'f7' ,width: 120 ,align:'right'},
				{ text: 'Posting',width: 50,sortable :false,dataIndex: 'f5',align:'center',
					renderer: function(value,meta){
						if(value==true)
							return '<span class="fa fa-check"></span>';
						return '<span class="fa fa-close"></span>';
					}
				},{ text: 'Lunas',width: 50,sortable :false,dataIndex: 'f6',align:'center',
					renderer: function(value,meta){
						if(value==true)
							return '<span class="fa fa-check"></span>';
						return '<span class="fa fa-close"></span>';
					}
				},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('KOPERASI_LIST.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('KOPERASI_LIST.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'KOPERASI_LIST.input',
			border:false,
			hidden:true,
			layout:'fit',
			title:'List Order',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('KOPERASI_LIST.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('KOPERASI_LIST.input.btnClose');
								}
							},{
								key:'f6',
								fn:function(){
									_click('KOPERASI_LIST.input.btnNew');
								}
							},{
								key:'f7',
								fn:function(){
									_click('KOPERASI_LIST.input.btnPosting');
								}
							},{
								key:'f8',
								fn:function(){
									_click('KOPERASI_LIST.input.btnPay');
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
					text: 'New',
					tooltip:'New <b>[F6]</b>',
					id:'KOPERASI_LIST.input.btnNew',
					iconCls:'fa fa-file',
					handler: function() {
						var $this = this;
						$this.closing = false;
						if (Ext.getCmp('KOPERASI_LIST.input.panel').qGetForm() == false)
							Ext.getCmp('KOPERASI_LIST.confirm').confirm({
								msg :'Apakah akan mengabaikan data yang sudah diubah?',
								allow : 'KOPERASI_LIST.close',
								onY : function() {
									var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
									table._getAddButton().enable();
									// Ext.getCmp('KOPERASI_LIST.input.btnSave').enable();
									Ext.getCmp('KOPERASI_LIST.input.payment').hide();
									Ext.getCmp('KOPERASI_LIST.input.panel').qReset();
									table.resetTable();
									var defaultPic=getSetting('KOPERASI_LIST','DEFAULT_EMPLOYEE');
									if(defaultPic==''){
										defaultPic='null';
									}
									eval("defaultPic="+defaultPic+";");
									Ext.getCmp('KOPERASI_LIST.input.f3').setValue(defaultPic);
									Ext.getCmp('KOPERASI_LIST.input.btnPosting').setIconCls('fa fa-check');
									Ext.getCmp('KOPERASI_LIST.input.btnPosting').setText('Posting');
									Ext.getCmp('KOPERASI_LIST.input.f2').setReadOnly(false);
									Ext.getCmp('KOPERASI_LIST.input.f3').setReadOnly(false);
									
									Ext.getCmp('KOPERASI_LIST.input').closing = false;
									Ext.getCmp('KOPERASI_LIST.input').setTitle('Penerimaan Vendor');
									Ext.getCmp('KOPERASI_LIST.input.payment').clear();
									Ext.getCmp('KOPERASI_LIST.input.panel').qSetForm();
									Ext.getCmp('KOPERASI_LIST.input.f2').focus();
								}
							});
						else{
							// Ext.getCmp('KOPERASI_LIST.input.btnSave').enable();
							Ext.getCmp('KOPERASI_LIST.input.panel').qReset();
							Ext.getCmp('KOPERASI_LIST.input.payment').hide();
							var defaultPic=getSetting('KOPERASI_LIST','DEFAULT_EMPLOYEE');
							if(defaultPic==''){
								defaultPic='null';
							}
							eval("defaultPic="+defaultPic+";");
							Ext.getCmp('KOPERASI_LIST.input.f3').setValue(defaultPic);
							Ext.getCmp('KOPERASI_LIST.input.tableOption').resetTable();
							Ext.getCmp('KOPERASI_LIST.input.btnPosting').setIconCls('fa fa-check');
							Ext.getCmp('KOPERASI_LIST.input.btnPosting').setText('Posting');
							Ext.getCmp('KOPERASI_LIST.input.f2').setReadOnly(false);
							Ext.getCmp('KOPERASI_LIST.input.f3').setReadOnly(false);
							
							Ext.getCmp('KOPERASI_LIST.input').closing = false;
							Ext.getCmp('KOPERASI_LIST.input').setTitle('Penerimaan Vendor');
							Ext.getCmp('KOPERASI_LIST.input.payment').clear();
							Ext.getCmp('KOPERASI_LIST.input.panel').qSetForm();
							Ext.getCmp('KOPERASI_LIST.input.f2').focus();
						}
						return false;
					}
				},{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'KOPERASI_LIST.input.btnSave',
					iconCls:'fa fa-save',
					handler: function() {
						var req=Ext.getCmp('KOPERASI_LIST.input.panel').qGetForm(true);
						if(req == false){
							var error=false;
							var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
							var objCek={};
							for(var i=0,iLen=table._getTotal();i<iLen;i++){
								if(table._get('qty',i)._getValue()==0){
									Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
									table._get('qty',i).focus();
									return false;
								}
								if(objCek[table._get('gin',i).getValue()]== undefined){
									objCek[table._get('gin',i).getValue()]='ADA';
								}else{
									Ext.create('App.cmp.Toast').toast({msg : 'Gin Tidak Boleh Sama.',type : 'warning'});
									table._get('barang',i).focus();
									return false;
								}
							}
							Ext.getCmp('KOPERASI_LIST.confirm').confirm({
								msg : 'Apakah akan menyimpan data ini?',
								allow : 'KOPERASI_LIST.save',
								onY : function() {
									var param = Ext.getCmp('KOPERASI_LIST.input.panel').qParams();
									param['unit_id']=getSetting('KOPERASI_LIST','UNIT_ID');
									Ext.Ajax.request({
										url : url + 'cmd?m=KOPERASI_LIST&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('KOPERASI_LIST.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('KOPERASI_LIST.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												for(var j=0,jLen=r.d.l.length; j<jLen;j++){
													var Oj=r.d.l[j];
													for(var i=0,iLen=table._getTotal();i<iLen;i++){
														var pid=table._get('id',i);
														if(pid.getValue()==null || pid.getValue()==''){
															pid.setValue(Oj);
															break;
														}
													}
												}
												// Ext.getCmp('KOPERASI_LIST.input.btnSave').enable();
												Ext.getCmp('KOPERASI_LIST.input.i').setValue(r.d.id);
												Ext.getCmp('KOPERASI_LIST.input.f1').setValue(r.d.code);
												Ext.getCmp('KOPERASI_LIST.list').refresh();
												Ext.getCmp('KOPERASI_LIST.input.f2').focus();
												Ext.getCmp('KOPERASI_LIST.input.panel').qSetForm();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('KOPERASI_LIST.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						}else{
							// if(Ext.getCmp('KOPERASI_LIST.input.p').getValue()=='ADD'){
								// Ext.create('App.cmp.Toast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							// }else{
								// Ext.create('App.cmp.Toast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							// }
						}
					}
				},{
					text: 'Posting',
					tooltip:'Posting/UnPosting <b>[F7]</b>',
					id:'KOPERASI_LIST.input.btnPosting',
					iconCls:'fa fa-check',
					handler: function(a) {
						var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
						if(a.getText()=='Posting'){
							_access('KOPERASI_LIST_posting',function(){
								if(Ext.getCmp('KOPERASI_LIST.input.c').getValue()==''){
									Ext.getCmp('KOPERASI_LIST.input.c').setValue('Y');
								}else{
									Ext.getCmp('KOPERASI_LIST.input.c').setValue('');
								}
								var req=Ext.getCmp('KOPERASI_LIST.input.panel').qGetForm(true);
								if(req == false){
									var error=false;
									var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
									var objCek={};
									for(var i=0,iLen=table._getTotal();i<iLen;i++){
										if(table._get('qty',i)._getValue()==0){
											Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
											table._get('qty',i).focus();
											return false;
										}
										if(objCek[table._get('gin',i).getValue()]== undefined){
											objCek[table._get('gin',i).getValue()]='ADA';
										}else{
											Ext.create('App.cmp.Toast').toast({msg : 'Gin Tidak Boleh Sama.',type : 'warning'});
											table._get('barang',i).focus();
											return false;
										}
									}
									Ext.getCmp('KOPERASI_LIST.confirm').confirm({
										msg : 'Apakah akan di Posting?',
										allow : 'KOPERASI_LIST.posting',
										onY : function() {
											var param = Ext.getCmp('KOPERASI_LIST.input.panel').qParams();
											param['unit_id']=getSetting('KOPERASI_LIST','UNIT_ID');
											Ext.Ajax.request({
												url : url + 'cmd?m=KOPERASI_LIST&f=posting',
												method : 'POST',
												params:param,
												before:function(){
													Ext.getCmp('KOPERASI_LIST.input').setLoading(true);
												},
												success : function(response) {
													Ext.getCmp('KOPERASI_LIST.input').setLoading(false);
													var r = ajaxSuccess(response);
													var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
													if (r.r == 'S') {
														for(var j=0,jLen=r.d.l.length; j<jLen;j++){
															var Oj=r.d.l[j];
															for(var i=0,iLen=table._getTotal();i<iLen;i++){
																var pid=table._get('id',i);
																if(pid.getValue()==null || pid.getValue()==''){
																	pid.setValue(Oj);
																	break;
																}
															}
														}
														var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
														for(var i=0, iLen=table._getTotal(); i<iLen;i++){
															table._get('barang',i).setReadOnly(true);
															table._get('qty',i).setReadOnly(true);
															table._get('harga',i).setReadOnly(true);
															table._get('del',i).disable();
														}
														table._getAddButton().disable();
														Ext.getCmp('KOPERASI_LIST.input.payment').show();
														Ext.getCmp('KOPERASI_LIST.input.i').setValue(r.d.id);
														Ext.getCmp('KOPERASI_LIST.input.f1').setValue(r.d.code);
														Ext.getCmp('KOPERASI_LIST.list').refresh();
														Ext.getCmp('KOPERASI_LIST.input.btnPosting').setIconCls('fa fa-close');
														Ext.getCmp('KOPERASI_LIST.input.btnPosting').setText('Unposting');
														// Ext.getCmp('KOPERASI_LIST.input.btnSave').disable();
														Ext.getCmp('KOPERASI_LIST.input.f2').setReadOnly(true);
														Ext.getCmp('KOPERASI_LIST.input.f3').setReadOnly(true);
														Ext.getCmp('KOPERASI_LIST.input.payment').payment_id=r.d.payment_id;
														Ext.getCmp('KOPERASI_LIST.input.payment').refresh();
														Ext.getCmp('KOPERASI_LIST.input.f2').focus();
														Ext.getCmp('KOPERASI_LIST.input.panel').qSetForm();
													}
												},
												failure : function(jqXHR, exception) {
													Ext.getCmp('KOPERASI_LIST.input').setLoading(false);
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									});
								}else if(req==true){
									//Ext.getCmp('KOPERASI_LIST.input').qClose();
								}
							});
						}else{
							_access('KOPERASI_LIST_unposting',function(){
								Ext.getCmp('KOPERASI_LIST.confirm').confirm({
									msg : 'Apakah akan di UnPosting?',
									allow : 'KOPERASI_LIST.posting',
									onY : function() {
										Ext.Ajax.request({
											url : url + 'cmd?m=KOPERASI_LIST&f=unposting',
											method : 'POST',
											params:{i:Ext.getCmp('KOPERASI_LIST.input.i').getValue()},
											before:function(){
												Ext.getCmp('KOPERASI_LIST.input').setLoading(true);
											},
											success : function(response) {
												Ext.getCmp('KOPERASI_LIST.input').setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
													for(var i=0, iLen=table._getTotal(); i<iLen;i++){
														table._get('barang',i).setReadOnly(false);
														table._get('qty',i).setReadOnly(false);
														// table._get('harga',i).setReadOnly(false);
														table._get('del',i).enable();
													}
													table._getAddButton().enable();
													Ext.getCmp('KOPERASI_LIST.list').refresh();
													Ext.getCmp('KOPERASI_LIST.input.payment').hide();
													// Ext.getCmp('KOPERASI_LIST.input.btnSave').enable();
													Ext.getCmp('KOPERASI_LIST.input.btnPosting').setIconCls('fa fa-check');
													Ext.getCmp('KOPERASI_LIST.input.btnPosting').setText('Posting');
													Ext.getCmp('KOPERASI_LIST.input.f2').setReadOnly(false);
													Ext.getCmp('KOPERASI_LIST.input.f3').setReadOnly(false);
													
													Ext.getCmp('KOPERASI_LIST.input.f2').focus();
													Ext.getCmp('KOPERASI_LIST.input.payment').refresh();
													Ext.getCmp('KOPERASI_LIST.input.panel').qSetForm();
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('KOPERASI_LIST.input').setLoading(false);
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								});
							});
						}
					}
				},{
					text:'Bayar',
					id:'KOPERASI_LIST.input.btnPay',
					tooltip:'Posting/UnPosting <b>[F8]</b>',
					iconCls:'fa fa-money',
					handler:function(){
						_access('KOPERASI_LIST_bayar',function(){
							if(Ext.getCmp('KOPERASI_LIST.input.payment').lunas !=1){
								Ext.getCmp('KOPERASI_LIST.input.payment').payment_code=Ext.getCmp('KOPERASI_LIST.input.f1').getValue();
								Ext.getCmp('KOPERASI_LIST.input.payment').pay();
							}else{
								Ext.create('App.cmp.Toast').toast({msg : 'Penjualan Sudah Lunas.',type : 'warning'});
							}
						});
					}
				},'->',{
					xType : 'button',
					text : 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'KOPERASI_LIST.input.btnClose',
					iconCls : 'fa fa-arrow-right',
					handler : function() {
						var req=Ext.getCmp('KOPERASI_LIST.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('KOPERASI_LIST.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'KOPERASI_LIST.close',
								onY : function() {
									Ext.getCmp('KOPERASI_LIST.input').hide();
									Ext.getCmp('KOPERASI_LIST.list').show();
								}
							});
						}else{
							Ext.getCmp('KOPERASI_LIST.input').hide();
							Ext.getCmp('KOPERASI_LIST.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'KOPERASI_LIST.input.panel',
					paddingBottom:false,
					layout:{
						type:'vbox',
						align:'stretch'
					},
					items:[
						{
							xtype:'form',
							border:false,
							cls:'i-transparent',
							style:'margin-bottom: 5px;',
							layout:'column',
							items:[
								{
									xtype:'ihiddenfield',
									name:'i',
									id:'KOPERASI_LIST.input.i'
								},{
									xtype:'ihiddenfield',
									name:'c',
									id:'KOPERASI_LIST.input.c'
								},{
									xtype:'itextfield',
									id : 'KOPERASI_LIST.input.f1',
									labelAlign:'top',
									width: 100,
									readOnly:true,
									name : 'f1',
									fieldLabel:'No. Jual'
								},{
									xtype:'idatefield',
									id : 'KOPERASI_LIST.input.f2',
									value:new Date(),
									width: 100,
									labelAlign:'top',
									allowBlank : false,
									name : 'f2',
									fieldLabel:'Tgl. Jual'
								},{
									xtype:'iselect',
									allowBlank : false,
									labelAlign:'top',
									fieldLabel:'Karyawan',
									id : 'KOPERASI_LIST.input.f3',
									valueField:'employee_id',
									textField:'name',
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
														Ext.getCmp('KOPERASI_LIST.input.f3').refresh();
													}
												}
											},{
												xtype:'ihiddenfield',
												name:'f6',
												database:{
													table:'app_employee',
													field:'M.tenant_id',
													type:'double',
													separator:'='
												},
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
														Ext.getCmp('KOPERASI_LIST.input.f3').refresh();
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
														Ext.getCmp('KOPERASI_LIST.input.f3').refresh();
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
																Ext.getCmp('KOPERASI_LIST.input.f3').refresh();
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
																Ext.getCmp('KOPERASI_LIST.input.f3').refresh();
															}
														},
														emptyText:'Akhir'
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
														Ext.getCmp('KOPERASI_LIST.input.f3').refresh();
													}
												}
											}
										],
										database:{
											table:'app_employee',
											inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender '
										},
										columns:[
											{ hidden:true,dataIndex: 'employee_id',database:{field:'employee_id'} },
											{ text: 'No. ID',width: 80, dataIndex: 'id_number' ,align:'center',database:{field:'id_number'} },
											{ text: 'Nama',width: 200,dataIndex: 'name',database:{field:"CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name"} },
											{ text: 'Jenis Kelamin',width: 100,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
											{ text: 'Tanggal Lahir',width: 100,align:'center', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
											{ text: 'Alamat',width: 100,dataIndex: 'address',flex:1,database:{field:'address'}  },
										]
									}
								}
							]
						},{
							xtype:'ilistinput',
							id:'KOPERASI_LIST.input.tableOption',
							name:'options',
							flex:3,
							bodyStyle:'margin-left: -1px;margin-right: -1px;',
							margin:false,
							loadQuery:true,
							onRemove:function(){
								var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
								table.count();
							},
							countLine:function(line){
								var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
								var jumlahQty=parseFloat(table._get('harga',line)._getValue())* parseFloat(table._get('qty',line)._getValue());
								table._get('jumlah',line)._setValue(jumlahQty);
							},
							count:function(){
								var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
								var jumlahHarga=0;
								for(var i=0,iLen=table._getTotal();i<iLen;i++){
									jumlahHarga+=parseFloat(table._get('jumlah',i)._getValue());
								}
								Ext.getCmp('KOPERASI_LIST.input.total')._setValue(jumlahHarga);
							},
							items:[
								{
									xtype:'iselect',
									width: 250,
									text:'Barang',
									emptyText:'Barang',
									allowBlank : false,
									valueField:'i',
									textField:'name',
									name:'barang',
									onReset:function(a){
										var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
										table._getForm(a.line).getForm().reset(true);
										table.countLine(a.line);
										table.count();
									},
									onSelect:function(a,b){
										var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
										
										if(table.loadQuery==true){
											Ext.Ajax.request({
												url : url + 'cmd?m=KOPERASI_LIST&f=getInitItem',
												method : 'GET',
												params : {
													i : a.i
												},
												success : function(response) {
													var r = ajaxSuccess(response);
													if (r.r == 'S'){
														var o=r.d.o,table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
														if(a.harga==null){
															a.harga=0;
														}
														table._get('harga',b.line)._setValue(a.harga);
														table._get('qty',b.line)._setValue(1);
														table._get('qty_sisa',b.line)._setValue(a.stock);
														table._get('gin',b.line).setValue(a.gin);
														table._get('fraction',b.line).setValue(a.frac);
														table._get('gin_id',b.line).setValue(a.gin_id);
														table._get('sat_kecil',b.line).setValue(o.f2);
														table._get('sat_kecil_id',b.line).setValue(o.f1);
														table.countLine(b.line);
														table.count();
													}
												},
												failure : function(jqXHR, exception) {
													ajaxError(jqXHR, exception,true);
												}
											});
										}
									},onBeforeShow:function(){
										Ext.getCmp('KOPERASI_LIST.input.item.unit_id').setValue(getSetting('KOPERASI_LIST','UNIT_ID'));
										Ext.getCmp('KOPERASI_LIST.input.item.partners_id').setValue(Ext.getCmp('KOPERASI_LIST.input.f3').getValue());
									},
									button:{
										urlData : url + 'cmd?m=KOPERASI_LIST&f=getListItem',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Barang',
											},{
												xtype:'ihiddenfield',
												name:'unit_id',
												id:'KOPERASI_LIST.input.item.unit_id',
											},{
												xtype:'ihiddenfield',
												name:'partners_id',
												id:'KOPERASI_LIST.input.item.partners_id',
											},{
												xtype:'itextfield',
												name:'f1',
												fieldLabel:'Kode Barang',
											},{
												xtype:'itextfield',
												name:'f3',
												fieldLabel:'Deskripsi',
											},{
												xtype:'itextfield',
												name:'f6',
												fieldLabel:'Gin Code',
											},{
												xtype:'itextfield',
												name:'f7',
												fieldLabel:'Bacth',
											},{
												xtype:'idropdown',
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
											{ hidden:true,dataIndex: 'i'},
											{ hidden:true,dataIndex: 'gin_id'},
											{ hidden:true,dataIndex: 'frac'},
											{ text: 'Tgl. Expire',width: 80, dataIndex: 'expire'},
											{ text: 'Tgl. Terima',width: 80, dataIndex: 'tgl'},
											{ text: 'Kode Gin',width: 100, dataIndex: 'gin'},
											{ text: 'No. Terima',width: 100, dataIndex: 'terima'},
											{ text: 'Barang',flex:1, dataIndex: 'name'},
											{ text: 'Stok',width: 100, dataIndex:'stock',align:'right',
												renderer: function(value,a){
													return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.sat_s;
												}
											},{ text: 'Harga',width: 100, dataIndex:'harga',align:'right',
												renderer: function(value){
													return Number(value).toLocaleString(window.navigator.language,{style: 'currency', currency: 'IDR',minimumFractionDigits:2 });;
												}
											},{ text: 'Aktif',width: 50,sortable :false,dataIndex: 'a',align:'center',
												renderer: function(value){
													if(value==true)
														return '<span class="fa fa-check"></span>';
													return '<span class="fa fa-close"></span>';
												}
											}
										]
									}
								},{
									xtype:'ihiddenfield',
									name:'id'
								},{
									xtype:'ihiddenfield',
									name:'fraction',
									value:0,
								},{
									xtype:'itextfield',
									name:'gin',
									text:'Kode Gin',
									readOnly:true,
									tabIndex:-1,
									allowBlank: false,
									width:120,
									emptyText:'Gin',
								},{
									xtype:'ihiddenfield',
									name:'gin_id'
								},{
									xtype:'itextfield',
									name:'sat_kecil',
									text:'Satuan',
									readOnly:true,
									tabIndex:-1,
									allowBlank: false,
									width:100,
									emptyText:'Satuan',
								},{
									xtype:'inumberfield',
									name:'qty_sisa',
									readOnly:true,
									tabIndex:-1,
									align:'right',
									text:'Sisa',
									allowBlank: false,
									emptyText:'Sisa',
									app:{decimal:0},
									width: 40,
								},{
									xtype:'inumberfield',
									name:'qty',
									align:'right',
									text:'Qty',
									allowBlank: false,
									emptyText:'Qty',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
											if(table._get('qty_sisa',a.line)._getValue()<a._getValue()){
												Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh Lebih dari '+table._get('qty_sisa',a.line)._getValue()+'.',type : 'warning'});
												table._get('qty',a.line).focus();
											}else{
												table.countLine(a.line);
												table.count();
											}
										}
									},
									app:{decimal:0},
									width: 40,
								},{
									xtype:'ihiddenfield',
									name:'sat_kecil_id'
								},{
									xtype:'inumberfield',
									name:'harga',
									text:'Harga ',
									readOnly:true,
									align:'right',
									app:{type:'CURRENCY',decimal:2},
									allowBlank: false,
									emptyText:'Harga Beli',
									width: 120,
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('KOPERASI_LIST.input.tableOption');
											table.countLine(a.line);
											table.count();
										}
									},
								},{
									xtype:'inumberfield',
									name:'jumlah',
									align:'right',
									tabIndex: -1,
									text:'Jumlah Rp',
									readOnly:true,
									app:{type:'CURRENCY',decimal:2},
									emptyText:'Jumlah Rp',
									width: 120,
								}
							]
						},{
							xtype:'form',
							layout:'column',
							border:false,
							style:'margin-bottom: 4px;',
							cls:'i-transparent',
							items:[
								{
									xtype:'inumberfield',
									id : 'KOPERASI_LIST.input.total',
									width: 170,
									fieldLabel:'Total',
									readOnly:true,
									labelWidth: 50,
									tabIndex: -1,
									name : 'total',
									app:{type:'CURRENCY',decimal:2},
								}
							]
						},{
							xtype:'ipayment',
							id:'KOPERASI_LIST.input.payment',
							flex:2,
							printing:false,
							paddingBottom:false,
							initStatus:function(s){
								if(s==1){
									Ext.getCmp('KOPERASI_LIST.input.btnPay').disable();
								}else if(s==0){
									Ext.getCmp('KOPERASI_LIST.input.btnPay').enable();
								}else{
									Ext.getCmp('KOPERASI_LIST.input.btnPay').disable();
								}
							},
							beforeDelete:function(){
								var boleh=false;
								_access('KOPERASI_LIST_delete_payment',function(){
									boleh=true;
								});
								return boleh;
							},
							beforeDetail:function(){
								var boleh=false;
								_access('KOPERASI_LIST_view_payment',function(){
									boleh=true;
								});
								return boleh;
							},
							beforeFaktur:function(){
								var boleh=false;
								_access('KOPERASI_LIST_faktur',function(){
									boleh=true;
								});
								return boleh;
							},
							beforeKwitansi:function(){
								var boleh=false;
								_access('KOPERASI_LIST_kwitansi',function(){
									boleh=true;
								});
								return boleh;
							},
						}
					]
				}
			],
		},{xtype:'iconfirm',id : 'KOPERASI_LIST.confirm'}
	]
});