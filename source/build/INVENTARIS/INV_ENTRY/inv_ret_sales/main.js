shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('INV_RET_SALES.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('INV_RET_SALES.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('INV_RET_SALES.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('INV_RET_SALES.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	xtype:'panel',
	id : 'INV_RET_SALES.main',
	border:false,
	layout:'fit',
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'INV_RET_SALES.search',
			modal:false,
			title:'Retur - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('INV_RET_SALES.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('INV_RET_SALES.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('INV_RET_SALES.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('INV_RET_SALES.search.f1').focus();
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
					id:'INV_RET_SALES.search.btnSearch',
					handler: function() {
						Ext.getCmp('INV_RET_SALES.list').refresh();
					}
				},{
					text:'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'INV_RET_SALES.search.btnReset',
					handler: function() {
						Ext.getCmp('INV_RET_SALES.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('INV_RET_SALES.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_RET_SALES.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'No. Retur',
							press:{
								enter:function(){
									_click('INV_RET_SALES.search.btnSearch');
								}
							},
							id:'INV_RET_SALES.search.f1'
						},{
							xtype:'itextfield',
							name:'f7',
							fieldLabel:'No. Jual',
							press:{
								enter:function(){
									_click('INV_RET_SALES.search.btnSearch');
								}
							},
							id:'INV_RET_SALES.search.f7'
						},{
							xtype:'itextfield',
							name:'f14',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('INV_RET_SALES.search.btnSearch');
								}
							},
							id:'INV_RET_SALES.search.f14'
						},{
							xtype:'iinput',
							label : 'Tgl. Retur',
							items : [
								 {
									xtype:'idatefield',
									name : 'f2',
									margin:false,
									press:{
										enter:function(){
											_click('INV_RET_SALES.search.btnSearch');
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
											_click('INV_RET_SALES.search.btnSearch');
										}
									},
									emptyText: 'Akhir'
								}
							]
						},{
							xtype:'itextfield',
							name:'f6',
							fieldLabel:'Nama Partner',
							press:{
								enter:function(){
									_click('INV_RET_SALES.search.btnSearch');
								}
							},
							id:'INV_RET_SALES.search.f6'
						},{ 
							xtype:'idropdown',
							id : 'INV_RET_SALES.search.f8',
							parameter:'ACTIVE_FLAG',
							name : 'f8',
							width: 200,
							press:{
								enter:function(){
									_click('INV_RET_SALES.search.btnSearch');
								},
							},
							fieldLabel:'Posting'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'INV_RET_SALES.list',
			params:function(bo){
				if(bo==true){
					var arr=Ext.getCmp('INV_RET_SALES.search.panel').qParams();
					arr['unit_id']=getSetting('INV_RET_SALES','UNIT_ID');
					return arr;
				}else{
					var obj={};
					obj[Ext.getCmp('INV_RET_SALES.dropdown').getValue()]=Ext.getCmp('INV_RET_SALES.text').getValue();
					obj['unit_id']=getSetting('INV_RET_SALES','UNIT_ID');
					return obj;
				}
			},
			url:url + 'cmd?m=INV_RET_SALES&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('INV_RET_SALES_DELETE',function(){
						Ext.getCmp('INV_RET_SALES.confirm').confirm({
							msg : "Apakah akan menghapus No. Retur '"+a.f1+"'",
							allow : 'INV_RET_SALES.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_RET_SALES&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('INV_RET_SALES.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('INV_RET_SALES.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('INV_RET_SALES.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_RET_SALES.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('INV_RET_SALES_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=INV_RET_SALES&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('INV_RET_SALES.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('INV_RET_SALES.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o,l=r.d.l,table=Ext.getCmp('INV_RET_SALES.input.tableOption');
									Ext.getCmp('INV_RET_SALES.input.panel').qReset();
									table.resetTable();
									table.loadQuery=false;
									for(var i=0, iLen=l.length; i<iLen;i++){
										var obj=l[i];
										if(i!==0){
											table._add();
										}
										table._get('id',i).setValue(obj.trans_detail_id);
										table._get('barang',i).setValue({i:obj.item_id,name:obj.item_name});
										table._get('fraction',i).setValue(obj.fraction);
										table._get('qty',i)._setValue(obj.qty);
										table._get('qty_sisa',i).setValue(obj.sisa);
										table._get('sat',i).setUrl(url + 'cmd?m=INV_RCV_VENDOR&f=loadMeasurementByItem&i='+obj.item_id,obj.measurement_id);	
										table._get('qty_sisa_sat',i)._setValue(obj.qty_sisa);
										table._get('gin',i).setValue(obj.gin_code);
										table._get('gin_id',i).setValue(obj.gin_id);
										table._get('harga',i)._setValue(obj.price);
										table._get('price',i).setValue(obj.buy_price);
										table._get('note',i).setValue(obj.description);
										table.countLine(i);
										if(o.posted ==1){
											table._get('barang',i).setReadOnly(true);
											table._get('qty',i).setReadOnly(true);
											table._get('sat',i).setReadOnly(true);
											table._get('harga',i).setReadOnly(true);
											table._get('del',i).disable();
											table._getAddButton().disable();
										}
									}
									table.loadQuery=true;
									Ext.getCmp('INV_RET_SALES.input.i').setValue(a.i);
									Ext.getCmp('INV_RET_SALES.input.f1').setValue(a.f1);
									Ext.getCmp('INV_RET_SALES.input.f2').setValue(o.retur_on);
									Ext.getCmp('INV_RET_SALES.input.f3').setValue(o.description);
									if(o.posted ==0){
										Ext.getCmp('INV_RET_SALES.input.btnPosting').setIconCls('fa fa-check');
										Ext.getCmp('INV_RET_SALES.input.btnPosting').setText('Posting');
										Ext.getCmp('INV_RET_SALES.input.f2').setReadOnly(false);
									}else{
										Ext.getCmp('INV_RET_SALES.input.btnPosting').setIconCls('fa fa-close');
										Ext.getCmp('INV_RET_SALES.input.btnPosting').setText('Unposting');
										Ext.getCmp('INV_RET_SALES.input.f2').setReadOnly(true);
									}
									table.count();
									Ext.getCmp('INV_RET_SALES.input').closing = false;
									Ext.getCmp('INV_RET_SALES.input').show();
									Ext.getCmp('INV_RET_SALES.input').setTitle('Retur Vendor');
									Ext.getCmp('INV_RET_SALES.input.f2').focus();
									Ext.getCmp('INV_RET_SALES.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('INV_RET_SALES.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('INV_RET_SALES.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('INV_RET_SALES.list').fn.update(a.dataRow);
				}
			},
			tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'-',
			{
				xtype:'iconfig',
				id:'INV_RET_SALES.config',
				code:[
					iif(_access('INV_RET_SALES_config_UNIT_ID')==false,'UNIT_ID',null)
				]
			},
			'-','->','-',{
				text: 'Tambah',
				tooltip:'Tambah <b>[F6]</b>',
				id:'INV_RET_SALES.btnAdd',
				iconCls: 'fa fa-plus',
				handler:function(a){
					var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
					table._getAddButton().enable();
					Ext.getCmp('INV_RET_SALES.input.panel').qReset();
					table.resetTable();
					Ext.getCmp('INV_RET_SALES.input').closing = false;
					Ext.getCmp('INV_RET_SALES.input.btnPosting').setIconCls('fa fa-check');
					Ext.getCmp('INV_RET_SALES.input.btnPosting').setText('Posting');
					Ext.getCmp('INV_RET_SALES.input.f2').setReadOnly(false);
					Ext.getCmp('INV_RET_SALES.input').show();
					Ext.getCmp('INV_RET_SALES.input').setTitle('Retur');
					Ext.getCmp('INV_RET_SALES.input.f2').focus();
					Ext.getCmp('INV_RET_SALES.input.panel').qSetForm();
				}
			},{
					xtype:'idropdown',
					id : 'INV_RET_SALES.dropdown',
					emptyText:'Pencarian',
					margin:false,
					value:'f1',
					data:[
						{id:'f1',text:'No. Retur'},
						{id:'f7',text:'No. Terima'},
						{id:'f6',text:'Nama Partner'},
						{id:'f14',text:'Keterangan'},
					],
					width: 150,
					press:{
						enter:function(){
							_click('INV_RET_SALES.btnSearch');
						}
					}
				},{
					xtype:'itextfield',
					width: 200,
					emptyText:'Pencarian',
					margin:false,
					tooltip:'Pencarian [Ctrl+f]',
					id:'INV_RET_SALES.text',
					press:{
						enter:function(){
							_click('INV_RET_SALES.btnSearch');
						}
					}
				},{
					iconCls: 'fa fa-search',
					tooltip:'Pencarian [F5]',
					id:'INV_RET_SALES.btnSearch',
					handler : function(a) {
						Ext.getCmp('INV_RET_SALES.list').refresh(false);
					}
				},'-',{
					text: 'Pencarian',
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'INV_RET_SALES.btnShowSearch',
					iconCls: 'fa fa-search',
					handler:function(a){
						Ext.getCmp('INV_RET_SALES.search').show();
						Ext.getCmp('INV_RET_SALES.search.f1').focus();
					}
				}
			],
			plugins: [{
				ptype: 'rowexpander',
				rowBodyTpl : new Ext.XTemplate()
			}],
			viewConfig: {
                listeners: {
                    expandbody: function(rowNode, record, expandNode) {
						var theTd = Ext.fly(expandNode).down('td');
                        theTd.mask('Loading...');
						theTd.update('<iframe src="'+url + 'cmd?m=INV_RET_SALES&f=getDetail&session='+_session_id+'&i='+record.data.i+'" style="width: 100%;" scrolling="no" onload="resizeIframe(this)"></iframe>');
                        theTd.unmask();
					}
				}
			},
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text:'No. Retur',width: 120,align:'center', dataIndex: 'f1' },
				{ text:'Tgl. Retur',width: 120,align:'center', dataIndex: 'f2' },
				{ text: 'Keterangan',flex: 1,dataIndex: 'f3'},
				{ text: 'Posting',width: 50,sortable :false,dataIndex: 'f5',align:'center',
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
						Ext.getCmp('INV_RET_SALES.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('INV_RET_SALES.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			xtype:'iwindow',
			id:'INV_RET_SALES.input',
			modal : true,
			maximized:true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('INV_RET_SALES.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('INV_RET_SALES.input.btnClose');
								}
							},{
								key:'f6',
								fn:function(){
									_click('INV_RET_SALES.input.btnNew');
								}
							},{
								key:'f7',
								fn:function(){
									_click('INV_RET_SALES.input.btnPosting');
								}
							},{
								key:'f8',
								fn:function(){
									_click('INV_RET_SALES.input.btnPay');
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
				id:'INV_RET_SALES.input.btnNew',
				iconCls:'fa fa-file',
				handler: function() {
					var $this = this;
					$this.closing = false;
					if (Ext.getCmp('INV_RET_SALES.input.panel').qGetForm() == false)
						Ext.getCmp('INV_RET_SALES.confirm').confirm({
							msg :'Apakah akan mengabaikan data yang sudah diubah?',
							allow : 'INV_RET_SALES.close',
							onY : function() {
								var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
								table._getAddButton().enable();
								Ext.getCmp('INV_RET_SALES.input.panel').qReset();
								table.resetTable();
								Ext.getCmp('INV_RET_SALES.input.btnPosting').setIconCls('fa fa-check');
								Ext.getCmp('INV_RET_SALES.input.btnPosting').setText('Posting');
								Ext.getCmp('INV_RET_SALES.input.f2').setReadOnly(false);
								
								Ext.getCmp('INV_RET_SALES.input').closing = false;
								Ext.getCmp('INV_RET_SALES.input').setTitle('Retur Vendor');
								Ext.getCmp('INV_RET_SALES.input.panel').qSetForm();
								Ext.getCmp('INV_RET_SALES.input.f2').focus();
							}
						});
					else{
						Ext.getCmp('INV_RET_SALES.input.panel').qReset();
						Ext.getCmp('INV_RET_SALES.input.tableOption').resetTable();
						Ext.getCmp('INV_RET_SALES.input.btnPosting').setIconCls('fa fa-check');
						Ext.getCmp('INV_RET_SALES.input.btnPosting').setText('Posting');
						Ext.getCmp('INV_RET_SALES.input.f2').setReadOnly(false);
						
						Ext.getCmp('INV_RET_SALES.input').closing = false;
						Ext.getCmp('INV_RET_SALES.input').setTitle('Retur Vendor');
						Ext.getCmp('INV_RET_SALES.input.panel').qSetForm();
						Ext.getCmp('INV_RET_SALES.input.f2').focus();
					}
					return false;
				}
			},'-',{
				text: 'Simpan',
				tooltip:'Simpan <b>[Ctrl+s]</b>',
				id:'INV_RET_SALES.input.btnSave',
				iconCls:'fa fa-save',
				handler: function() {
					var req=Ext.getCmp('INV_RET_SALES.input.panel').qGetForm(true);
					if(req == false){
						var error=false;
						var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
						var objCek={};
						for(var i=0,iLen=table._getTotal();i<iLen;i++){
							if(table._get('qty',i)._getValue()==0){
								Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
								table._get('qty',i).focus();
								return false;
							}
							if(objCek[table._get('gin',i).getValue()]== undefined){
								objCek[table._get('gin',i).getValue()]={};
							}
							if(objCek[table._get('gin',i).getValue()][table._get('sat',i).getValue()]== undefined){
								objCek[table._get('gin',i).getValue()][table._get('sat',i).getValue()]="ADA";
							}else{
								Ext.create('App.cmp.Toast').toast({msg : 'Gin dan Satuan Tidak Boleh Sama.',type : 'warning'});
								table._get('sat',i).focus();
								return false;
							}
						}
						Ext.getCmp('INV_RET_SALES.confirm').confirm({
							msg : 'Apakah akan menyimpan data ini?',
							allow : 'INV_RET_SALES.save',
							onY : function() {
								var param = Ext.getCmp('INV_RET_SALES.input.panel').qParams();
								param['unit_id']=getSetting('INV_RET_SALES','UNIT_ID');
								Ext.Ajax.request({
									url : url + 'cmd?m=INV_RET_SALES&f=save',
									method : 'POST',
									params:param,
									before:function(){
										Ext.getCmp('INV_RET_SALES.input').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('INV_RET_SALES.input').setLoading(false);
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
											Ext.getCmp('INV_RET_SALES.input.i').setValue(r.d.id);
											Ext.getCmp('INV_RET_SALES.input.f1').setValue(r.d.code);
											Ext.getCmp('INV_RET_SALES.list').refresh();
											Ext.getCmp('INV_RET_SALES.input.f2').focus();
											Ext.getCmp('INV_RET_SALES.input.panel').qSetForm();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('INV_RET_SALES.input').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					}else if(req==true)
						Ext.getCmp('INV_RET_SALES.input').qClose();
				}
			},'-',{
				text: 'Posting',
				tooltip:'Posting/UnPosting <b>[F7]</b>',
				id:'INV_RET_SALES.input.btnPosting',
				iconCls:'fa fa-check',
				handler: function(a) {
					var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
					if(a.getText()=='Posting'){
						_access('INV_RET_SALES_posting',function(){
							if(Ext.getCmp('INV_RET_SALES.input.c').getValue()==''){
								Ext.getCmp('INV_RET_SALES.input.c').setValue('Y');
							}else{
								Ext.getCmp('INV_RET_SALES.input.c').setValue('');
							}
							var req=Ext.getCmp('INV_RET_SALES.input.panel').qGetForm(true);
							if(req == false){
								var error=false;
								var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
								var objCek={};
								for(var i=0,iLen=table._getTotal();i<iLen;i++){
									if(table._get('qty',i)._getValue()==0){
										Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh 0.',type : 'warning'});
										table._get('qty',i).focus();
										return false;
									}
									if(objCek[table._get('gin',i).getValue()]== undefined){
										objCek[table._get('gin',i).getValue()]={};
									}
									if(objCek[table._get('gin',i).getValue()][table._get('sat',i).getValue()]== undefined){
										objCek[table._get('gin',i).getValue()][table._get('sat',i).getValue()]="ADA";
									}else{
										Ext.create('App.cmp.Toast').toast({msg : 'Gin dan Satuan Tidak Boleh Sama.',type : 'warning'});
										table._get('sat',i).focus();
										return false;
									}
								}
								Ext.getCmp('INV_RET_SALES.confirm').confirm({
									msg : 'Apakah akan di Posting?',
									allow : 'INV_RET_SALES.posting',
									onY : function() {
										var param = Ext.getCmp('INV_RET_SALES.input.panel').qParams();
										param['unit_id']=getSetting('INV_RET_SALES','UNIT_ID');
										Ext.Ajax.request({
											url : url + 'cmd?m=INV_RET_SALES&f=posting',
											method : 'POST',
											params:param,
											before:function(){
												Ext.getCmp('INV_RET_SALES.input').setLoading(true);
											},
											success : function(response) {
												Ext.getCmp('INV_RET_SALES.input').setLoading(false);
												var r = ajaxSuccess(response);
												var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
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
													var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
													for(var i=0, iLen=table._getTotal(); i<iLen;i++){
														table._get('barang',i).setReadOnly(true);
														table._get('qty',i).setReadOnly(true);
														table._get('sat',i).setReadOnly(true);
														table._get('harga',i).setReadOnly(true);
														table._get('del',i).disable();
													}
													table._getAddButton().disable();
													Ext.getCmp('INV_RET_SALES.input.i').setValue(r.d.id);
													Ext.getCmp('INV_RET_SALES.input.f1').setValue(r.d.code);
													Ext.getCmp('INV_RET_SALES.list').refresh();
													Ext.getCmp('INV_RET_SALES.input.btnPosting').setIconCls('fa fa-close');
													Ext.getCmp('INV_RET_SALES.input.btnPosting').setText('Unposting');
													Ext.getCmp('INV_RET_SALES.input.f2').setReadOnly(true);
													Ext.getCmp('INV_RET_SALES.input.f2').focus();
													Ext.getCmp('INV_RET_SALES.input.panel').qSetForm();
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('INV_RET_SALES.input').setLoading(false);
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								});
							}else if(req==true){
								Ext.getCmp('INV_RET_SALES.input').qClose();
							}
						});
					}else{
						_access('INV_RET_SALES_unposting',function(){
							Ext.getCmp('INV_RET_SALES.confirm').confirm({
								msg : 'Apakah akan di UnPosting?',
								allow : 'INV_RET_SALES.posting',
								onY : function() {
									Ext.Ajax.request({
										url : url + 'cmd?m=INV_RET_SALES&f=unposting',
										method : 'POST',
										params:{i:Ext.getCmp('INV_RET_SALES.input.i').getValue()},
										before:function(){
											Ext.getCmp('INV_RET_SALES.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('INV_RET_SALES.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
												for(var i=0, iLen=table._getTotal(); i<iLen;i++){
													table._get('barang',i).setReadOnly(false);
													table._get('qty',i).setReadOnly(false);
													table._get('sat',i).setReadOnly(false);
													table._get('harga',i).setReadOnly(false);
													table._get('del',i).enable();
												}
												table._getAddButton().enable();
												Ext.getCmp('INV_RET_SALES.list').refresh();
												Ext.getCmp('INV_RET_SALES.input.btnPosting').setIconCls('fa fa-check');
												Ext.getCmp('INV_RET_SALES.input.btnPosting').setText('Posting');
												Ext.getCmp('INV_RET_SALES.input.f2').setReadOnly(false);
												Ext.getCmp('INV_RET_SALES.input.f2').focus();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('INV_RET_SALES.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						});
					}
				}
			},'-'
			],
			items:[
				{
					xtype:'ipanel',
					id : 'INV_RET_SALES.input.panel',
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
									id:'INV_RET_SALES.input.i'
								},{
									xtype:'ihiddenfield',
									name:'c',
									id:'INV_RET_SALES.input.c'
								},{
									xtype:'itextfield',
									id : 'INV_RET_SALES.input.f1',
									labelAlign:'top',
									width: 100,
									readOnly:true,
									name : 'f1',
									fieldLabel:'No. Retur'
								},{
									xtype:'idatefield',
									id : 'INV_RET_SALES.input.f2',
									value:new Date(),
									width: 100,
									labelAlign:'top',
									allowBlank : false,
									name : 'f2',
									fieldLabel:'Tgl. Retur'
								},{
									xtype:'itextfield',
									id : 'INV_RET_SALES.input.f3',
									labelAlign:'top',
									maxLength:128,
									name : 'f3',
									width: 250,
									fieldLabel:'Keterangan'
								}	
							]
						},{
							xtype:'ilistinput',
							id:'INV_RET_SALES.input.tableOption',
							name:'options',
							flex:3,
							bodyStyle:'margin-left: -1px;margin-right: -1px;',
							margin:false,
							loadQuery:true,
							onRemove:function(){
								var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
								table.count();
							},
							countLine:function(line){
								var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
								var jumlahQty=parseFloat(table._get('harga',line)._getValue())* parseFloat(table._get('qty',line)._getValue());
								table._get('jumlah',line)._setValue(jumlahQty);
							},
							count:function(){
								var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
								var jumlahHarga=0;
								for(var i=0,iLen=table._getTotal();i<iLen;i++){
									jumlahHarga+=parseFloat(table._get('jumlah',i)._getValue());
								}
								Ext.getCmp('INV_RET_SALES.input.total')._setValue(jumlahHarga);
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
										var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
										table._getForm(a.line).getForm().reset(true);
										table.countLine(a.line);
										table.count();
									},
									onSelect:function(a,b){
										var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
										
										if(table.loadQuery==true){
											Ext.Ajax.request({
												url : url + 'cmd?m=INV_RET_SALES&f=getInitItem',
												method : 'GET',
												params : {
													i : a.i
												},
												success : function(response) {
													var r = ajaxSuccess(response);
													if (r.r == 'S'){
														var o=r.d.o,table=Ext.getCmp('INV_RET_SALES.input.tableOption');
														if(a.harga==null){
															a.harga=0;
														}
														table._get('sat',b.line).setUrl(url + 'cmd?m=INV_RCV_VENDOR&f=loadMeasurementByItem&i='+a.i,o.f1);	
														table._get('harga',b.line)._setValue(a.harga);
														table._get('price',b.line).setValue(a.harga);
														table._get('qty',b.line)._setValue(1);
														table._get('qty_sisa',b.line).setValue(a.stock);
														table._get('qty_sisa_sat',b.line).setValue(a.stock);
														table._get('gin',b.line).setValue(a.gin);
														table._get('fraction',b.line).setValue(a.frac);
														table._get('gin_id',b.line).setValue(a.gin_id);
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
										Ext.getCmp('INV_RET_SALES.input.item.unit_id').setValue(getSetting('INV_RET_SALES','UNIT_ID'));
									},
									button:{
										urlData : url + 'cmd?m=INV_RET_SALES&f=getListItem',
										windowWidth: 800,
										items:[
											{
												xtype:'itextfield',
												name:'f8',
												fieldLabel:'No. Jual',
											},{
												xtype:'itextfield',
												name:'f2',
												fieldLabel:'Nama Barang',
											},{
												xtype:'ihiddenfield',
												name:'unit_id',
												id:'INV_RET_SALES.input.item.unit_id',
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
											{ text: 'Batch',width: 100, dataIndex: 'batch'},
											{ text: 'No. Jual',width: 100, dataIndex: 'terima'},
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
									xtype:'ihiddenfield',
									name:'qty_sisa'
								},{
									xtype:'ihiddenfield',
									name:'price'
								},{
									xtype:'idropdown',
									name:'sat',
									text:'Satuan',
									listeners:{
										select:function(a,b,c){
											var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
											if(table.loadQuery==true){
												table._get('fraction',a.line).setValue(b[0].raw.f1);
												table._get('qty_sisa_sat',a.line)._setValue(table._get('qty_sisa',a.line).getValue()/b[0].raw.f1);
												table._get('qty',a.line)._setValue(table._get('qty_sisa_sat',a.line)._getValue());
												table._get('harga',a.line)._setValue(table._get('price',a.line).getValue()*b[0].raw.f1);
												table.countLine(a.line);
												table.count();
											}
										}
									},
									allowBlank: false,
									width:100,
									emptyText:'Satuan',
								},{
									xtype:'inumberfield',
									name:'qty_sisa_sat',
									readOnly:true,
									tabIndex:-1,
									align:'right',
									text:'Sisa',
									allowBlank: false,
									emptyText:'Sisa',
									app:{decimal:0},
									width: 40,
								},{
									xtype:'ihiddenfield',
									name:'fraction'
								},{
									xtype:'inumberfield',
									name:'qty',
									align:'right',
									text:'Qty',
									allowBlank: false,
									emptyText:'Qty',
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
											if(table._get('qty_sisa_sat',a.line)._getValue()<a._getValue()){
												Ext.create('App.cmp.Toast').toast({msg : 'Qty Tidak Boleh Lebih dari '+table._get('qty_sisa_sat',a.line)._getValue()+'.',type : 'warning'});
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
									align:'right',
									app:{type:'CURRENCY',decimal:2},
									allowBlank: false,
									emptyText:'Harga Beli',
									width: 120,
									listeners:{
										blur:function(a){
											var table=Ext.getCmp('INV_RET_SALES.input.tableOption');
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
								},{
									xtype:'itextfield',
									name:'note',
									text:'Catatan',
									width:200,
									emptyText:'Catatan',
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
									id : 'INV_RET_SALES.input.total',
									width: 170,
									fieldLabel:'Total',
									readOnly:true,
									labelWidth: 50,
									tabIndex: -1,
									name : 'total',
									app:{type:'CURRENCY',decimal:2},
								}
							]
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('INV_RET_SALES.input.panel').qGetForm() == false)
					Ext.getCmp('INV_RET_SALES.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'INV_RET_SALES.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'INV_RET_SALES.confirm'}
	]
});