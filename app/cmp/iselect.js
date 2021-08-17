/*
	import cmp.ibuttonfind
	import cmp.idropdown
*/
Ext.define('ISelect', {
	alias:'widget.iselect',
	extend: 'Ext.form.Panel',layout:'column',border:false,labelAlign:'right',fieldLabel:'',button:{},forceSelection:true,property:{type:'select'},dynamic:false,valueField:'id',
	textField:'text',showKey:false,submit:undefined,readOnly:false,value:null,adaValue:false,noClear:true,textValue:false,cls:'i-transparent',allowBlank : true,margin:false,
	initComponent:function(){
		var cmp=this.items,$this=this, style='',hiddenReset=true,cls='',val=this.value;
		if($this.fieldLabel==''){$this.labelAlign='right';}
		if($this.labelAlign=='top'){this.button.labelTop=true;style+=iif(_mobile==true,'margin-top: 23px;','margin-top: 20px;');}
		if($this.margin!=false){cls=' i-select-no-margin';style='margin-top: 0px !important;';}else{this.bodyStyle='padding-right:4px;';}
		this.button.xtype='ibuttonfind';
		this.button.iconCls='fa fa-search';
		this.button.id_parent=this.id;
		this.button.id=this.id+'-button';
		this.button.tabIndex= -1;
		this.button.hidden=$this.readOnly;
		this.button.style='margin-top: 5px !important;border-radius: 0px !important;border-left:0px !important;'+style;
		this.button.onBeforeShow=function(ini,win,grid,pnl){
			if($this.showKey==true){if(pnl.items.items[0] != undefined && pnl.items.items[0].focus != undefined){pnl.items.items[0].setValue(Ext.getCmp($this.id+'-combo').getRawValue());}}
			if($this.onBeforeShow != undefined){$this.onBeforeShow($this,pnl.items.items);}
		};
		this.getValue=function(){return Ext.getCmp($this.id+'-combo').getValue();};
		this.setReadOnly=function(bool){
			$this.readOnly=bool;
			Ext.getCmp($this.id+'-combo').setReadOnly(bool);
			if(bool==true){Ext.getCmp($this.id+'-button').hide();Ext.getCmp($this.id+'-reset').hide();
			}else{Ext.getCmp($this.id+'-button').show();if(this.getValue() != null && this.getValue()!=''){Ext.getCmp($this.id+'-reset').show();}}
		};
		this.setValue=function(a){
			if(a!= null && a !=''){
				$this.noClear=false;
				if($this.textValue==true){
					if($this.dynamic==true){var val=a.trim().replace(/  +/g, ' ');a=val.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});}
					Ext.getCmp($this.id+'-combo').addReset([{id:a,text:a}]);
					Ext.getCmp($this.id+'-combo').setValue(a);
				}else{
					Ext.getCmp($this.id+'-combo').addReset([{id:a[$this.valueField],text:a[$this.textField]}]);
					Ext.getCmp($this.id+'-combo').setValue(a[$this.valueField]);
				}
				$this.noClear=true;
				if($this.readOnly==false){Ext.getCmp($this.id+'-reset').show();}
				$this.adaValue=true;
				if($this.onSelect != undefined){$this.onSelect(a,$this);}
			}else{
				Ext.getCmp($this.id+'-reset').hide();
				Ext.getCmp($this.id+'-combo').addReset([]);
				Ext.getCmp($this.id+'-combo').setValue(null);
				$this.adaValue=false;
			}
		};
		this.focus=function(){Ext.getCmp($this.id+'-combo').focus();};
		this.validate=function(){return Ext.getCmp($this.id+'-combo').validate();};
		this.button.onEnter=function(a){if($this.textValue==true){a=a[$this.valueField];}$this.setValue(a);$this.close();};
		this.button.onDblClick=function(a){if($this.textValue==true){a=a[$this.valueField];}$this.setValue(a);$this.close();};
		this.button.onHideWindow=function(ini,win,grid,pnl){
			setTimeout(function(){
				if($this.showKey==true){
					Ext.getCmp($this.id+'-combo').focus();
				}else{Ext.getCmp($this.id+'-button').focus();}
				$this.showKey=false;
			},200);
		};
		this.refresh=function(){Ext.getCmp($this.id+'-button').refresh();};
		this.close=function(){Ext.getCmp($this.id+'-button').windowClose();};
		if($this.value != null && $this.value !='' && $this.readOnly==false){hiddenReset=false;}
		this.items=[
			{
				xtype:'idropdown',
				cls:'i-select'+cls,
				id:$this.id+'-combo',
				labelAlign:$this.labelAlign,
				columnWidth: 1,
				margin:false,
				name:$this.name,
				submit:$this.submit,
				database:$this.database,
				forceSelection:$this.forceSelection,
				readOnly:$this.readOnly,
				allowBlank:$this.allowBlank,
				fieldLabel:$this.fieldLabel,
				hideTrigger: true,
				listeners:{
					keydown:function(txt,e){
						if(e.keyCode==13){if($this.adaValue==false){$this.showKey=true;_click($this.id+'-button');}}
						var nav=navigator.platform.match("Mac");
						if (e.keyCode == 68 && ( nav? e.metaKey : e.ctrlKey)){$this.setValue(null);if($this.onReset != undefined){$this.onReset($this);}}
					},
					dirtychange:function(){if($this.adaValue==true && $this.noClear==true){$this.setValue(null);}},
					blur:function(a){if($this.textValue==true)$this.setValue(a.getValue());}
				}
			},{
				xtype:'button',
				iconCls:'fa fa-trash fa-red',
				text:'',
				id:$this.id+'-reset',
				tabIndex: -1,
				hidden:hiddenReset,
				style:'margin-top: 5px !important;border-radius: 0px !important;border-left:0px !important;'+style,
				handler:function(){
					$this.setValue(null);
					$this.adaValue=false;
					if($this.onReset != undefined){$this.onReset($this);}
					Ext.getCmp($this.id+'-combo').focus();
				}
			},this.button,{xtype:'button',tabIndex:-1,iconCls:'fa fa-info-circle',hidden:iif(this.note != undefined && this.note!='',false,true),tooltip:this.note,border: 0,style:'background: none;margin-top:'+iif(this.labelAlign=='top','20','5')+'px;'}
		];
		this.callParent(arguments);
		if(val != null){this.setValue(val);}
	}
});