Ext.define('App.cmp.TableEditor',{
	extend:'Ext.grid.Panel',
	selType: 'cellmodel',
	buttonAdd:true,
	border:false,
	property:{},
	buttonDelete:true,
	columnLines :true,
	lineNumber:true,
	initComponent:function(){
		var $this=this,
			fields=[],
			database=[],
			data={},
			col=null,
			property=this.property,
			event=this.event;
		this.plugins= new Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1,
			listeners:{
				beforeedit:function(){
				}
			}
		});
		this.viewConfig = {
			trackOver : false
		}
		property.type='tableeditor';
		for(var i=0,iLen=$this.columns.length ; i<iLen; i++){
			col=$this.columns[i];
			if(col.name != undefined){
				fields.push(col.name);
				database.push(col.database);
				col.dataIndex=col.name;
				col.sortable= false;
				col.menuDisabled = true;
			}
			if(col.editor != undefined){
				col.tdCls= 'x-editor-cell';
			}
			if(col.xtype != undefined){
				if(col.xtype=='numbercolumn'){
					col.value=0;
					col.align='right';
				}
				if(col.xtype=='datecolumn'){
					
					col.format='d/m/Y';
					col.value=new Date();
				}
			}
			if(col.value != undefined)
				data[col.name]=col.value;
		}
		if($this.buttonDelete==true){
			var column={};
			column.xtype='actioncolumn';
			column.text='Hapus';
			column.width=50;
			column.align='center';
			column.menuDisabled = true;
			if($this.plainDelete!= undefined && $this.plainDelete==true){
				column.tdCls="x-plain-cell";
			}
			column.items=[{
				iconCls:'i-table_delete',
                tooltip: 'Hapus',
				text:'',
                handler: function(grid, rowIndex, colIndex) {
					if($this.beforeDelete != undefined){
						if($this.beforeDelete(rowIndex,$this.getStore().getRange())==true){
							var rec = grid.getStore().removeAt(rowIndex);
						}
					}else{
						var rec = grid.getStore().removeAt(rowIndex);
					}
					if(grid.getStore().getRange().length==0)
						$this.addLine();
                },
				getClass: function(v, meta, rec) {  
					if($this.beforeShowDelete != undefined){
						if($this.beforeShowDelete(v, meta, rec)==true){
							return 'i-table_delete';
						}else{
							return '';
						}
					}else{
						return 'i-table_delete';
					}
				}
            }];
			this.columns.unshift(column);
		}
		if($this.lineNumber==true){
			this.columns.unshift( {xtype: 'rownumberer'});
		}
		
		var store=new Ext.data.ArrayStore({
			fields:fields
		});
		$this.store=store;
		if($this.buttonAdd ==true){
			$this.tbar=[
				{
					text:'Tambah',
					iconCls:'i-table_add',
					handler:function(grid, rowIndex, colIndex){
						if($this.beforeAdd != undefined){
							if($this.beforeAdd(rowIndex,$this.getStore().getRange())==true){
								$this.addLine();
							}
						}else{
							$this.addLine();
						}
					}
				}
			]
		};
		$this.deleteLine=function(idx){
			$this.getStore().removeAt(idx);
		}
		$this.addLine=function(arr){
			if(arr != undefined){
				$this.store.add(arr);
			}else{
				$this.store.add(data);
			}
		}
		$this.resetTable=function(){
			this.store.loadData([],false);
			this.addLine();
		}
		$this.set=function(value,col,idx){
			if(idx==undefined){
				idx=this.getSelectIndex();
			}
			if(this.getStore().getRange()[idx].set != undefined){
				this.getStore().getRange()[idx].set(value,col);
			}
		}
		$this.getTotal=function(){
			return this.getStore().getRange().length;
		}
		$this.get=function(col,idx){
			if(idx==undefined){
				idx=this.getSelectIndex();
			}
			return this.getStore().getRange()[idx].data[col];
		}
		$this.getSelectIndex=function(){
			return this.items.items[0].getSelectionModel().selection.row;
		}
		$this.check=function(){
			var range=this.getStore().getRange(),
				allow=true,
				bre=null,
				col=null;
			for(var i=0,iLen=range.length ; i<iLen; i++){
				bre=false;
				for(var j=0,jLen=$this.columns.length; j<jLen; j++){
					col=$this.columns[j];
					if(col.name != undefined && col.allowBlank==false){
						//console.log(range[i]);
						if(col.xtype == undefined){
							if(range[i].data[col.name]== undefined || (range[i].data[col.name]==null)){
								Ext.create('App.cmp.Toast').toast({
									msg : "Kolom '"+col.text+"' Baris - "+(i+1)+" Harap diIsi.",
									type : 'warning'
								});
								$this.editingPlugin.startEdit(i,j);
								allow=false;
								bre=true;
								break;
							}
						}else{
							if(col.xtype=='numbercolumn'){
								if(col.min != undefined){
									if(range[i].data[col.name]!= undefined && (range[i].data[col.name]<col.min)){
										Ext.create('App.cmp.Toast').toast({
											msg : "Kolom '"+col.text+"' Baris - "+(i+1)+" Tidak Boleh Kurang dari "+col.min+".",
											type : 'warning'
										});
										$this.editingPlugin.startEdit(i,j);
										allow=false;
										bre=true;
										break;
									}
								}
								if(col.max != undefined){
									if(range[i].data[col.name]!= undefined && (range[i].data[col.name]>col.max)){
										Ext.create('App.cmp.Toast').toast({
											msg : "Kolom '"+col.text+"' Baris - "+(i+1)+" Tidak Boleh Lebih dari "+col.max+".",
											type : 'warning'
										});
										$this.editingPlugin.startEdit(i,j);
										allow=false;
										bre=true;
										break;
									}
								}
								if(range[i].data[col.name]==undefined){
									Ext.create('App.cmp.Toast').toast({
										msg : "Kolom '"+col.text+"' Baris - "+(i+1)+" isi dengan benar.",
										type : 'warning'
									});
									$this.editingPlugin.startEdit(i,j);
									allow=false;
									bre=true;
									break;
								}
							}
							if(col.xtype=='datecolumn'){
								if(range[i].data[col.name]== undefined || (range[i].data[col.name]==null)){
									Ext.create('App.cmp.Toast').toast({
										msg : "Kolom '"+col.text+"' Baris - "+(i+1)+" isi dengan benar",
										type : 'warning'
									});
									$this.editingPlugin.startEdit(i,j);
									allow=false;
									bre=true;
									break;
								}
							}
						}
					}
				}
				if(bre==true)
					break;
			}
			if(allow==true){
				for(var i=0,iLen=range.length; i<iLen ; i++){
					var bre=false;
					for(var j=0,jLen=$this.columns.length; j<jLen; j++){
						var bre1=false;
						if($this.columns[j].name != undefined)
							if($this.columns[j].primary != undefined && $this.columns[j].primary==true)
								for(var k=0,kLen=range.length; k<kLen ; k++)
									if(i != k && range[i].data[$this.columns[j].name]==range[k].data[$this.columns[j].name]){
										Ext.create('App.cmp.Toast').toast({
											msg : 'Data Untuk '+$this.title+" di Kolom '"+$this.columns[j].text+"' Baris - "+(i+1)+" Tidak Boleh Sama dengan Baris -"+(k+1),
											type : 'warning'
										});
										allow=false;
										bre=true;
										bre1=true;
										break;
									}
						if(bre1==true)
							break;
					}
					if(bre==true)
						break;
				}
			}
			return allow;
		}
		$this.val=function(arr,arr2){
			var range=$this.getStore().getRange();
			for(var j=0,jLen=fields.length; j<jLen; j++)
				arr[fields[j]+'[]']=[];
			for(var i=0,iLen=range.length; i< iLen; i++)
				for(var j=0; j<fields.length; j++){
					arr[fields[j]+'[]'].push(range[i].data[fields[j]]);
					if(database[j] != undefined){
						var base=database[j] ;
						if(arr2[base.table]== undefined){
							arr2[base.table]=[];
						}
						var ada=false;
						for(var k=0,kLen=arr2[base.table].length; k<kLen;k++){
							if(arr2[base.table][k][base.field]==undefined){
								ada=true;
								arr2[base.table][k][base.field]={};
								var field=arr2[base.table][k][base.field];
								field['value']=range[i].data[fields[j]];
								if(base.type != undefined){
									field['type']=base.type;
								}
								if(base.primary != undefined && base.primary===true){
									field['primary']=true;
								}
							}
						}
						if(ada==false){
							var dataField={};
							dataField[base.field]={};
							var field=dataField[base.field];
							field['value']=range[i].data[fields[j]];
							if(base.type != undefined){
								field['type']=base.type;
							}
							if(base.primary != undefined && base.primary===true){
								field['primary']=true;
							}
							arr2[base.table].push(dataField);
						}
					}
				}
					
		}
		$this.setVal=function(arr){
			$this.store.loadData([],false);
			$this.store.add(arr);
		}
		this.callParent(arguments);
		//this.addLine();
	}
})