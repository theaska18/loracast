Ext.define('App.cmp.ListInput',{
	extend:'Ext.Panel',cls:'i-transparent',minHeight:150,addLine:true,paddingBottom:false,property:{},layout:{type:'vbox',align:'stretch'},margin:true,
	initComponent:function(){
		var $this=this,property=this.property,fields=[],database=[];
		this.item=this.items;
		property.type='tableeditor';
		var header=[{xtype:'displayfield',value:'&nbsp;',cls:'x-column-header',width:34,border:false,}];
		var allWidth=true,widthHeader=34,objItem=null;
		for(var i=0,iLen=this.item.length; i<iLen; i++){
			objItem=this.item[i];
			fields.push(objItem.name);
			database.push(objItem.database);
			if(objItem.text != undefined && objItem.text != null && objItem.text != ''){
				var hidden=false,item={xtype:'displayfield'};
				if(objItem.type=='App.cmp.HiddenField' || objItem.xtype=='ihiddenfield' || (objItem.hidden !=undefined && objItem.hidden==true)){item.hidden=true;hidden=true;}
				item.value=objItem.text;
				if(objItem.flex !== undefined && hidden==false){item.flex=objItem.flex;allWidth=false;}
				if(objItem.align !== undefined){item.style='text-align:'+objItem.align+';';item.value+='&nbsp;&nbsp;';}
				if(objItem.width !== undefined && hidden==false){item.width=objItem.width+4;widthHeader+=(objItem.width+4)}
				header.push(item);
			}
		}
		this.fields=fields;
		this.colDatabase=database;
		this.widthHeader=widthHeader;
		this.allWidth=allWidth;
		header.push({xtype:'displayfield',value:'&nbsp;',id:$this.id+'hiddenScroll',width:18,hidden:true});
		var comPanel={xtype:'panel',id:$this.id+'_header',layout:{type:'hbox',align:'stretch'},style:'margin-right:-1px;',height: 42,border:false,items:header,cls:'i-transparent x-column-header',bodyCls:'x-parent-header',autoScroll:true};
		if(allWidth==true){comPanel['width']=widthHeader;}
		this.items=[
			comPanel,
			{xtype:'form',id:$this.id+'_listItem',style:'margin-top:-18px;margin-left:-1px;margin-bottom:-1px;margin-right:-1px;',paddingBottom:false,border:true,flex:1,items:[],autoScroll:true,
				listeners:{
					render: function(p){
						p.body.on('scroll', function(e, t){
							var height = p.getTargetEl().getHeight();
							Ext.getCmp($this.id+'_header').body.dom.scrollLeft = t.scrollLeft;
						}, p);
					}
				}
			},
		];
		this._add=function(stat){
			var item=this.item,listItem=$this.listItem,listItems=listItem.items,panel=null,cls='i-transparent',itm=[];
			if(listItems.length %2 == 0){cls='i-transparent i-table-list-gan'}
			var cmpPanel={
				xtype:'form',cls:cls,paddingBottom:false,width: 2000,layout:{type:'hbox',align:'stretch'},
				style:'padding-top:2px;padding-bottom:2px;',border:false
			};
			if($this.allWidth==true){cmpPanel['width']=$this.widthHeader;}else{cmpPanel['anchor']='100%';}
			itm.push({
				xtype:'button',name:'del',width: 25,margin: "0 4 0 4",iconCls:'fa fa-trash',line:listItems.length-1,tabIndex: -1,
				handler:function(a){$this._remove(a.line);}
			});
			var line=0;
			if($this._getTotal != undefined){line=$this._getTotal();}
			var objItem=null;
			for(var i=0,iLen=item.length;i<iLen;i++){
				objItem=item[i];
				objItem.line=line;
				if(objItem.style==undefined){objItem.style=''}
				objItem.field=true;
				objItem.margin= "0 4 0 0";
				if(objItem.align != undefined){objItem.style+='text-align:'+objItem.align+';';}
				if(objItem.xtype != undefined && objItem.xtype !== '' ){
					if(objItem.xtype=='idynamicoption'){objItem.type=objItem.type_dynamic;}
					itm.push(objItem);
				}else{
					var type=objItem.type;
					if(objItem.type=='App.cmp.DynamicOption'){
						objItem.type=objItem.type_dynamic;
						objItem.type_component='App.cmp.DynamicOption';
					}else{if(objItem.type_component != undefined && objItem.type_component != ''){type=objItem.type_component;}}
					itm.push(Ext.create(type,objItem));
				}
			}
			cmpPanel['items']=itm;
			listItem.insert(line,cmpPanel);
			if($this.onAdd != undefined){$this.onAdd($this);}
			if($this.onAddLine != undefined){$this.onAddLine($this);}
			this._onScroll();
		}
		
		this.callParent(arguments);
		this.listItem=Ext.getCmp(this.id+'_listItem');
		this._addAddButton();
		if(this.addLine==true){
			this._add();
		}
	},
	setVal:function(arr){
		this.resetTable();
		var $this=this,item=$this.listItem.items.items;
		for(var i=0,iLen=arr.length;i<iLen; i++){
			if(i !=0){$this._add();}
			var items=item[i].items.items;
			for(var j=0,jLen=items.length;j<jLen; j++){for(var k in arr[i]){if(k==items[j].name){items[j].setValue(arr[i][k]);}}}
		}
	},
	_getTotal:function(){return this.listItem.items.items.length-1;},
	_getValue:function(){
		var $this=this,arr=[],item=$this.listItem.items.items,obj={},items=null,items1=null;
		for(var i=0,iLen=item.length-1;i<iLen;i++){
			items=item[i].items.items;
			obj={};
			for(var j=0,jLen=items.length;j<jLen;j++){
				items1=items[j];
				if(items1.property != undefined && items1.property.type=='numberfield'){
					obj[items1.name]=items1._getValue();
				}else if(items1.property != undefined && items1.property.type=='datefield'){
					obj[items1.name]=items1.val();
				}else{
					if(items1.getValue != undefined && items1.name != undefined){obj[items1.name]=items1.getValue();}
				}
			}
			arr.push(obj);
		}
		return arr;
	},
	val:function(arr,arr2){
		var range=this._getValue(),fields=this.fields,database=this.colDatabase;
		for(var j=0,jLen=fields.length; j<jLen; j++){arr[fields[j]+'[]']=[];}
		for(var i=0,iLen=range.length; i< iLen; i++){
			for(var j=0; j<fields.length; j++){
				arr[fields[j]+'[]'].push(range[i][fields[j]]);
				if(database[j] != undefined){
					var base=database[j] ;
					if(arr2[base.table]== undefined){arr2[base.table]=[];}
					var ada=false;
					for(var k=0,kLen=arr2[base.table].length; k<kLen;k++){
						if(arr2[base.table][k][base.field]==undefined){
							ada=true;
							arr2[base.table][k][base.field]={};
							var field=arr2[base.table][k][base.field];
							field['value']=range[i][fields[j]];
							if(base.type != undefined){field['type']=base.type;}
							if(base.primary != undefined && base.primary===true){field['primary']=true;}
						}
					}
					if(ada==false){
						var dataField={};
						dataField[base.field]={};
						var field=dataField[base.field];
						field['value']=range[i][fields[j]];
						if(base.type != undefined){field['type']=base.type;}
						if(base.primary != undefined && base.primary===true){field['primary']=true;}
						arr2[base.table].push(dataField);
					}
				}
			}
		}
	},
	_remove:function(line){
		var allow=true
		if(this.onBeforeRemove!= undefined){allow=this.onBeforeRemove(this,line);}
		if(allow!==false){
			var $this=this,listItem=$this.listItem,item=listItem.items;itm=item.getAt(line);
			listItem.remove(itm);
			var listItems=item.items;
			for(var i=0,iLen=listItems.length-1;i<iLen;i++){
				var itms=listItems[i];
				itms.removeCls('i-table-list-gan');
				if(i %2 == 0){itms.addCls('i-table-list-gan')}
				var listItem1=itms.items.items;
				for(var j=0,jLen=listItem1.length; j<jLen;j++){listItem1[j].line=i;}
			}
			if(item.length==1){if($this.addLine==true){$this._add();}}
			if(this.onRemove!= undefined){allow=this.onRemove(this);}
		}
		this._onScroll();
	},
	_get:function(name,line){
		var $this=this,item=undefined,items=$this.listItem.items.items[line].items.items;
		for(var i=0,iLen=items.length;i<iLen;i++){if(items[i].name==name){item=items[i];break;}}
		return item;
	},
	_getForm:function(line){return this.listItem.items.items[line];},
	resetTable:function(){var $this=this;$this.listItem.removeAll();$this._addAddButton();
		if($this.addLine==true){
			$this._add();
		}
	this._onScroll();},
	check:function(){
		var allow=true,$this=this,item=$this.listItem.items.items,items=null,items1=null;
		for(var i=0,iLen=item.length;i<iLen;i++){
			items=item[i].items.items;
			for(var j=0,jLen=items.length;j<jLen;j++){
				items1=items[j];
				if(items1.readOnly==undefined ||(items1.readOnly != undefined && items1.readOnly===false)){
					if(items1.validate != undefined){
						if(items1.validate()==false){
							if(items1.focus !=undefined){items1.focus();}
							allow=false;
							break;
						}
					}
				}
			}
		}
		return allow;
	},
	_focus:function(line){
		var allow=true,$this=this,item=$this.listItem.items.items,items=null,items1=null;
		if(line ==undefined){line=item.length-2;}
		items=item[line].items.items;
		for(var j=0,jLen=items.length;j<jLen;j++){
			items1=items[j];
			if(items1.field ===true && (items1.disabled == undefined || (items1.disabled != undefined && items1.disabled ===false))){items1.focus();break;}
		}
		return allow;
	},
	_removeAddButton:function(){
		var $this=this,listItem=$this.listItem,item=listItem.items;itm=item.getAt(listItem.items.length-1);
		listItem.remove(itm);
		this._onScroll();
	},
	_getAddButton:function(){
		var $this=this,listItem=$this.listItem,item=listItem.items;itm=item.getAt(listItem.items.length-1);
		return itm.items.items[0];
	},
	_addAddButton:function(){
		var $this=this,item=this.item,listItem=$this.listItem,listItems=listItem.items;
		listItem.add({xtype:'panel',cls:'i-transparent',anchor:'100%',style:'padding-top:2px;padding-bottom:4px;',border:false,items:[{
			xtype:'button',
			width: 25,margin: "0 0 0 4",iconCls:'fa fa-plus',
			handler:function(){$this._add();$this._focus();}
		}]});
		this._onScroll();
	},
	_onScroll:function(){
		var $this=this,item=this.item,listItem=$this.listItem,listItems=listItem.items;
		if(listItem.body != undefined && listItem.items.items[0].el != undefined){
			var tambahan=0;
			if($this.allWidth==true){tambahan=17};
			if(listItem.body.dom.getBoundingClientRect().height<=(((listItem.items.items[0].el.dom.getBoundingClientRect().height)*(listItems.length))+tambahan)){
				Ext.getCmp($this.id+'hiddenScroll').show();
			}else{Ext.getCmp($this.id+'hiddenScroll').hide();}
		}
	},
	
});