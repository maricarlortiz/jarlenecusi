/*
* HDV Components
*/
;(function(){
var hc = {};

var _config = {};

hc.config = {
	set: function(key,val){
		if(typeof arguments[0] == 'object'){
			var dict = arguments[0];
			for(var dictKey in dict){
				_config[dictKey] = dict[dictKey];
			}
			return;
		}
		_config[key] = val;
	},
	get: function(key,def){
		if(!def) def = null;
		if(!key) return _config;
		if(typeof _config[key] == 'undefined') return def;
		return _config[key];
	}
};

window.hc = hc;
})();
;(function(exports){

var loc = {
	code :null,

	text:{
	},

	setText : function(key,str){
		if(typeof key == 'object'){
			for(var _key in key)
				loc.setText(_key, key[_key]);
			return ;
		}
		loc.text[key] = str;
	},

	getText: function(key,params){
		var str = key;
		var text_lib = loc.text;
		var loc_code = loc.code;
		if(typeof text_lib == 'function'){
			str = text_lib(key);
		}else if(loc_code !=null && typeof text_lib[loc_code][key] != 'undefined'){
			str = text_lib[loc_code][key];
		}else if(typeof text_lib[key] != 'undefined'){
			str = text_lib[key];
		}
		if(params ){
			for(var key in params){
				str = str.replace('{'+key+'}',params[key]);
			}
		}
		return str;
	}
};

exports.loc = loc;
})(hc);
;(function(exports){

var net = {};
net.url = function(val,prefix){
	var str = prefix;
	if(prefix && prefix.substr(prefix.length-1,1) != '/'){
		if(val && val.substr(0,1)!='/')
			str += '/';
	}
	return str + val;
};
net.site_url = function(val){
	return net.url(val, exports.config.get('site_url',''));
};
net.asset_url = function(val){
	return net.url(val, exports.config.get('asset_url',''));
};
exports.net = net;
})(hc);
;(function(exports,$){

var initUIElement = function(scope){
	var $scope = $(scope);
    $(ui.modules).each(function(idx, callback){
    	callback($scope);
    });
};

var ui = {
	modules: [],
	initUIElement: initUIElement
};

exports.ui = ui;

})(hc,jQuery)
/*
* HDV Components
*/
;(function(exports){

exports.showMessage = function(text, type, timeout, layout){
	var cfg = {
	    'text': '-', layout:'topCenter','type':type
	};
	if(typeof text == 'object'){
		cfg = text;
	}else{
		cfg.text = text;
	}
	if(!cfg.type) cfg.type = 'default';
	if(layout) cfg.layout = layout;
	if(timeout) cfg.timeout = timeout;


	return noty(cfg);
}

})(hc.ui);

/* Create Dialog based on Bootstrap Modal component */
(function(exports, $){
var DialogOptions = {
	show: true,
	removeWhenHidden: true,
	template: '<div class="modal"><div class="modal-dialog"><div class="modal-content"></div></div></div>',
	buttonTemplate: '<button type="button" class="btn" />',
	fade: true,
	header: '<div class="modal-header" />',
	footer: '<div class="modal-footer" />',
	body: '<div class="modal-body" />',
	title: null,
	message: null,
	buttons: null
};

var Dialog = function(options){
	var self = this;
	this.$elm = null;
	this.options  = options;

	var $header, $body,$footer;
	var isLocked = false;

	var $ui = null;
	var $overlay = $('<div class="modal-overlay" style="position:absolute; left:0; top:0; width:100%; height:100%; z-index:1000; background:white; opacity:0.1;" />')
	function lock(){
		$ui = self.$elm.find('.btn,.form-control,select');
		$ui.addClass('disabled');
		$body.append($overlay);
	}

	function unlock(){
		$ui.removeClass('disabled');
		$overlay.remove();
	}

	function install(){
		if(self.$elm != null){
			return;
		}
		var c, $c;
		if(typeof options.template == 'function'){
			c = options.template.apply(self,null);
		}else{
			c = options.template;
		}
		var $elm = $(c);
		self.$elm = $elm;

		if(typeof options.header == 'function'){
			c = options.header.apply(self,null);
		}else{
			c = options.header;
		}
		$header = $c = $(c);
		$elm.find('.modal-content').append($c );


		if(typeof options.body == 'function'){
			c = options.body.apply(self,null);
		}else{
			c = options.body;
		}
		$body = $c = $(c);
		$elm.find('.modal-content').append($c );


		if(typeof options.footer == 'function'){
			c = options.footer.apply(self,null);
		}else{
			c = options.footer;
		}
		$footer = $c = $(c);
		$elm.find('.modal-content').append($c );


		if(options.title != null){
			$header.append( typeof options.title == 'function' ? options.title.apply(self, null) : options.title );
		}

		if(options.message != null){
			$body.append( typeof options.message == 'function' ? options.message.apply(self, null) : options.message );
		}

		if(options.buttons != null){
			for(var buttonName in options.buttons){
				var buttonCfg = options.buttons[buttonName];

				var $b;
				if(buttonCfg.template){
					if(typeof buttonCfg.template == 'function')
						$b = $( buttonCfg.template.apply(self, [buttonCfg]) );
					else 
						$b = $( buttonCfg.template);

				}else{
					if(typeof options.buttonTemplate == 'function')
						$b = $( options.buttonTemplate.apply(self, [buttonCfg]) );
					else 
						$b = $( options.buttonTemplate);

				}

				if(buttonCfg.type){

					if(typeof buttonCfg.type == 'function')
						$b.attr('type', buttonCfg.type.apply(self, [buttonCfg]) );
					else 
						$b.attr('type', buttonCfg.type);
				}

				if(buttonCfg.label){

					if(typeof buttonCfg.label == 'function')
						$b.append( buttonCfg.label.apply(self, [buttonCfg]) );
					else 
						$b.append( buttonCfg.label);
				}else{
					$b.append(buttonName);
				}
				if(buttonCfg.class){

					if(typeof buttonCfg.class == 'function')
						$b.addClass( buttonCfg.class.apply(self, [buttonCfg]) );
					else 
						$b.addClass( buttonCfg.class);
				}
				if(buttonCfg.events){
					$(buttonCfg.events).each(function(idx, opts){
						$b.on(opts.type, function(){
							opts.callback.apply(self, arguments);
						});

					});
				}

				$b.appendTo($footer);
			}
		}

		$elm.appendTo('body').modal({show:false});
		$elm.on('show.bs.modal', function(){
			if(typeof options.onShow == 'function'){
				options.onShow.apply(self,null);
			}
		});
		$elm.on('shown.bs.modal', function(){
			if(typeof options.onShown == 'function'){
				options.onShown.apply(self,null);
			}
		});
		$elm.on('hide.bs.modal', function(){
			if(typeof options.onHide == 'function'){
				options.onHide.apply(self,null);
			}
		});
		$elm.on('hidden.bs.modal', function(){
			if(typeof options.onHidden == 'function'){
				options.onHidden.apply(self,null);
			}
			if(options.removeWhenHidden){
				destroy();
			}
		});

		if(options.fade){
			$elm.addClass('fade');
		}

	}

	function show(){
		if(self.$elm == null){
			install();
		}
		if(self.$elm !=null){
			self.$elm.modal('show');
		}
	}

	function hide(){

		if(self.$elm !=null){
			self.$elm.modal('hide');
		}
	}

	function destroy(){
		if(self.$elm)
			self.$elm.remove();
		self.$elm = null;
	}

	this.show = show;
	this.hide = hide;
	this.install = install;
	this.destroy = destroy;
	this.lock = lock;
	this.unlock = unlock;

	if(typeof options.onInit == 'function'){
		options.onInit.apply(self,null);
	}

	if(options.show){
		show();
	}

};
Dialog.defaults = DialogOptions;
exports.Dialog = Dialog;
exports.createDialog = function(opts){
	return new Dialog($.extend({},DialogOptions, opts));
};

})(hc.ui, jQuery);
;(function(exports,$){
if(!$) {
	console.error('ElementParser require jQuery');
	return;
}

// private variables
var _registeredDirectives = {}; // only registered directives will be fired on ElementParser
var _directiveKeys = [];

// Define default directives;
var defaultDirectives = {
	'text': function($elm, str, val, prefix){
		if(typeof moment != 'undefined' && $elm.attr(''+prefix+'date-format') == 'ago')
			val = moment(val).fromNow();
		$elm.text( val );
	},
	'href': function($elm, str, val, prefix){
		$elm.prop('href', val );
	},
	'target': function($elm, str, val, prefix){
		$elm.prop('target', val );
	},
	'placeholder': function($elm, str, val, prefix){
		$elm.prop('placeholder', val );
	},
	'data': function($elm, str, val, prefix, key, parser, data){
		val = defaultContentParser(data, '(function(){return '+str+'})()');
		if(typeof val == 'object'){
			for(var key in val)
				$elm.data(key, val[key] );
		}
	},
	'attr': function($elm, str, val, prefix, key, parser, data){
		val = defaultContentParser(data,  '(function(){return '+str+'})()');
		if(typeof val == 'object'){
			for(var key in val)
				$elm.attr(key, val[key] );
		}
	},
	'id': function($elm, str, val, prefix){
		$elm.prop('id', val );
	},
	'name': function($elm, str, val, prefix){
		$elm.prop('name', val );
	},
	'class': function($elm, str, val, prefix){
		$elm.attr('class', val );
	},
	'src': function($elm, str, val, prefix){
		$elm.prop('src', val );
	},
	'value': function($elm, str, val, prefix){
		$elm.val(val );
	},
	'title': function($elm, str, val, prefix){
		$elm.prop('title', val );
	},
	'html': function($elm, str, val, prefix){
		$elm.html(val);
	},
	'alt': function($elm, str, val, prefix){
		$elm.prop('alt', val );
	},
	'width': function($elm, str, val, prefix){
		$elm.width( val );
	},
	'height': function($elm, str, val, prefix){
		$elm.height( val );
	},
	'background-image': function($elm, str, val, prefix){
		$elm.css('background-image', val ? 'url('+ val+')' : '' );
	},
	'if': function($elm, str, val, prefix){
		if(!val){
			$elm.remove();
		}
	},
	'not-if': function($elm, str, val, prefix){
		if(val){
			$elm.remove();
		}
	},
	'loop': function($elm, str, val, prefix, key, parser, data){
		if(str.indexOf('..')==-1) return;
		var parts = str.split('..');
		var ary = parser(parts[1]);
		var $parent = $elm.parent();
		$elm.remove();
		$elm.attr(prefix+key,null);
		if($.isArray(ary)){
			$.each(ary, function(i, val){
				var _scope = {};
				_scope[ parts[0] ] = val;

				var $child = $elm.clone();
				$parent.append($child);

				hc.ui.ElementParser($child, _scope, prefix);
			});
		}
	}
};
defaultDirectives['data'].isInternalParser = true;
defaultDirectives['attr'].isInternalParser = true;
defaultDirectives['loop'].isInternalParser = true;


// Helper functions
var addDirective = function(key, callback, pos){
	if(!pos ) pos = _directiveKeys.length;

	if(typeof callback != 'function'){
		console.error('ElementParser.addDirective must pass function at 2th parameter');
		return false;
	}
	
	_registeredDirectives [key] = callback;
	if(pos>= _directiveKeys.length)
		_directiveKeys.push(key);
	else
		_directiveKeys.splice(pos, 0, key);
	return true;
};
var getDirectiveAt = function(pos){
	if(pos < 0 || pos >= _directiveKeys.length) return null;
	return _directiveKeys[pos];
};
var getDirective = function(key){
	if(typeof _registeredDirectives[key] != 'undefined')
		return _registeredDirectives[key];
};
var replaceDirective = function(key, callback){
	if(typeof _registeredDirectives[key] != 'undefined')
		_registeredDirectives[key] = callback;
};
var removeDirective = function(key){
	var pos = -1;
	var _newKeys = [];
	for(var i = 0 ; i < _directiveKeys.length; i ++)
	{
		if(_directiveKeys[i] != key)
		{
			_newKeys.push(_directiveKeys[i]);
		}
	}

	if(typeof _registeredDirectives[key] !='undefined') {
		_registeredDirectives[key] = null;
		delete _registeredDirectives[key];
	}

	_directiveKeys = _newKeys;
};
var defaultContentParser = function(row, field){
	if( typeof field == 'undefined') return;
	if(typeof row[field] != 'undefined'){
		return row[field];
	}
	try{
		with(row){
			return eval(field);
		}
	}catch(err){}
	return '';
};

for(var key in defaultDirectives)
	addDirective(key, defaultDirectives[key]);

// ElementParser
var ElementParser = function($rowElm, data, prefix){
	if(!prefix) prefix = 'rc-';
	var contentParser = arguments[1];
	if(typeof contentParser != 'function') contentParser = function(exp){return ElementParser.contentParser(data,exp);};
	if(typeof contentParser != 'function') contentParser = function(exp){return defaultContentParser(data,exp);};

	$.each(_directiveKeys,function(i, _directiveKey){
		var _directiveCallback = _registeredDirectives[_directiveKey];
		var _parser = typeof _directiveCallback.parser == 'function' ? _directiveCallback.parser : contentParser;
		var _isInternalParser = typeof _directiveCallback.isInternalParser != 'undefined' && _directiveCallback.isInternalParser ? _directiveCallback.isInternalParser : false;

		var attrName = prefix+_directiveKey;

		var $list = $rowElm.find('['+attrName+']');
		//console.log(_directiveKey, $list);
		$list.each(function(){
			var $elm = $(this);
			var exp = $elm.attr(attrName);
			var val = _isInternalParser ? null : _parser(exp);
			_directiveCallback.call($rowElm, $elm, exp, val, prefix, _directiveKey, _parser, data);
		});
	});
};

ElementParser.defaultDirectives = defaultDirectives;
ElementParser.contentParser = defaultContentParser;
ElementParser.addDirective = addDirective;
ElementParser.getDirectiveAt = getDirectiveAt;
ElementParser.getDirective = getDirective;
ElementParser.removeDirective = removeDirective;
ElementParser.replaceDirective = replaceDirective;
exports.ElementParser = ElementParser;
})(hc.ui,jQuery);
/*
* HDV Components
*/
;(function(exports){

exports.showLoaderAnimation = function(){
	$('<div class="global-loader"><div class="global-loader-wrap"><div class="loader"></div></div></div>').appendTo('body');
}

exports.hideLoaderAnimation = function(){
	$('.global-loader').remove();
}

})(hc.ui);

/* Load an iframe instance based on Bootstrap3 Modal, All contents and buttons should be should within the iframe */
(function(exports, $){

if(top.hc && top.hc.ui && top.hc.ui.openModal) {exports.openModal = top.hc.ui.openModal;return;}
if(parent.hc && parent.hc.ui && parent.hc.ui.openModal) {exports.openModal = parent.hc.ui.openModal;return;}
	
var openModal = function(url,options){
	if(typeof url == 'undefined') return false;
	if(!options) options = {};
	options = $.extend({} ,options, openModal.defaults);
	
	var key = 'ins_'+ (new Date()).getTime()+'_'+ ( Math.random()*1000 << 0);
	
	var queryStr = url.indexOf('?') != -1 ? url.substr( url.indexOf('?') ) : '';
	url+= (queryStr == '') ? '?':'&';
	url+= '_modalIns='+key;
	if(typeof options.urlAppendStr != 'undefined' && options.urlAppendStr!=''){
		url+= '&'+options.urlAppendStr;
	}
	
	
	
	var $elm = $('<div class="modal"></div>'), $root = $elm, $parent = $elm;
	openModal.instances[ key ] = $elm;
	
	var headerElm = null;
	if(typeof options.header =='function'){
		headerElm = options.header();
	}else if(typeof options.header == 'string' && options.header.length>0){
		headerElm = $(options.header);
	}else if(typeof options.title == 'string' && options.title.length>0){
		headerElm = $('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>'+options.title+'</h3></div>');
	}
	
	var footerElm = null;
	if(typeof options.footer =='function'){
		footerElm = options.footer();
	}else if(typeof options.footer == 'string' && options.header.length>0){
		footerElm = $(options.footer);
	}
	$root = $('<div class="modal-dialog" />');
	if(options.size == 'large')
		$root.addClass('modal-lg');
	if(options.size == 'fluid')
		$root.addClass('modal-fluid');
	$root.appendTo($elm);
	$parent = $root;
	
	//if(headerElm || footerElm){
		$parent = $('<div class="modal-content" />');
		$parent.appendTo($root);
	//}
	
	if(headerElm){
		$parent.append(headerElm);
	}
	
	var $content = $('<iframe class="modal-iframe" />').width(options.width).height(options.height).prop('src',url);
	$content.appendTo($parent);
	
	if(footerElm) $parent.append(footerElm);
	
	if(headerElm || footerElm){
		//$content.addClass('modal-body');
	}
	
	$elm.on('hidden.bs.modal', function(evt){
		
		if(typeof options.srcElement != 'undefined' && options.srcElement){
			$(options.srcElement).trigger('sb.hidden',evt);
		}
		if(typeof options.onHidden != 'undefined' && options.onHidden){
			options.onHidden.apply($elm, []);
		}
		
		openModal.instances[ key ] = null;
		$elm.remove();
		$elm = null;
		options = null;
		
	}).on('shown.bs.modal', function(evt){
		
		if(typeof options.srcElement != 'undefined' && options.srcElement){
			$(options.srcElement).trigger('sb.shown',evt);
		}
		if(typeof options.onShown != 'undefined' && options.onShown){
			options.onShown.apply($elm, []);
		}
	});
	
	return $elm.modal(options);
};
openModal.instances = {};

openModal.defaults = {
	width:'100%',
	height:500,
	urlAppendStr: 'dialog=yes',
	size: 'fluid',
	header:'',
	footer:'',
	title:'',
	removeWhenClose:true
};

exports.openModal = openModal;

})(hc.ui, top.jQuery || parent.jQuery || self.jQuery);
/*
* HDV Components
*/
;(function($){

var RecordEditor = function(scope, options){
	var self = this;
	var $scope = $(scope);
	var $form = $scope.find('form.ifrm');
	self.options = options;
	self.$scope = $scope;
	self.$form = $form;


	if($scope.length < 1){
		console.error('No element found by passed scope:', scope);
	}
	$scope.addClass('record-editor');

	if(options.apiPathPrefix) self.apiPathPrefix = options.apiPathPrefix;
	if(options.id) self.id = options.id;
	if(options.richEditorConfig) self.richEditorConfig = options.richEditorConfig;
	if(options.text) self.text = options.text;

	$(window).on('keyup',function(evt){
		if(!evt.altKey && !evt.shiftKey && (evt.ctrlKey || evt.commandKey) && (String.fromCharCode(evt.keyCode).toLowerCase() == 's')){
			$form.submit();
			evt.preventDefault();
		}
	});
	
	$scope.on('click', '[re-action]', function(evt){
		evt.preventDefault();
		var action = $(this).attr('re-action');


		if( action == 'close' ) {
		window.close();
			return;
		}

		if( action == 'save' || action == 'submit' ) {
			self.submit();
			return;
		}

		if( action == 'publish' ) {
			self.publish();
			return;
		}

		if(typeof options.onExecuteAction == 'function')
			options.onExecuteAction(action,this);

	});


	if(typeof self.initialize == 'function' ){
		self.initialize();
	}
	if(typeof options.initialize == 'function' ){
		options.initialize(self);
	}
	this.handleArgument = function(method){
		if(arguments.length < 1) return self;
		var args = []; for(var i = 1; i < arguments.length; i ++) args.push(arguments[i]);
		if(method && typeof self[method] == 'function'){
			return self[method].apply(self,args);
		}
	};
}

var editorPrototype = {
	apiPathPrefix: '',
	id: null,
	bridge: null,

	richEditorConfig: null,

	initialize: function(){
		var self  = this;
		var $scope = self.$scope;
		var $form = self.$form;
		
		self.updateStatus();

		hc.ui.initUIElement($scope);

		if(typeof window.tinyMCE != 'undefined'){
			var tinyMCEConfig = self.richEditorConfig || {};
			$scope.find('.rich-editor').each(function(){
				tinymce.init(tinyMCEConfig);
			});
		}

		var queries = Fragment.parseQuery(location.search);

		bridge = new SelectorBridge();
		this.bridge = bridge;
		bridge.multiSelect = queries.multiple == 'yes';
		bridge.getIds = function(){
			if(self.id)
				return [self.id];
			return [];
		}
		bridge.onSelectTooMuch = function(){
			hc.ui.showMessage( hc.loc.getText('error_select_too_much') , 'error');
		}
		bridge.onUpdate = function(){
		}
		bridge.onReload = function(){
			bridge.ids = bridge.getIds();
		}
		if(queries && queries.callback)
			bridge.connect(queries.callback);

		/* ---------- Form Submission ---------- */


		var processing = false;
		var formConfig = {
			onSubmit:function(){
				
				$scope.find('.form-group').removeClass('has-error').removeClass('has-warning');


				if(self.options.iframe){
					if(this.action.substr( this.action.length -5, 5 )!='.html')
						this.action +='.html';
				}

				if(processing){
					hc.ui.showMessage( hc.loc.getText('error_processing'),'error');
					return false;
				}
				
				var success = true;
				var error_required_empty = [];
				$scope.find('[re-required]').each(function(){
					var val = $(this).val();
					if(!val || val.length < 1){

						success = false;

						error_required_empty.push(this);
					}
				});

				$scope.find('[re-error]').each(function(){
					success = false;
					var val = $(this).attr('re-error');
					if(val && val.length >0){

						hc.ui.showMessage( val,'error');
					}
				});

				if(!success){
					if(error_required_empty.length> 0){

						$(error_required_empty).each(function(){
							$(this).parents('.form-group').addClass('has-error');
						});

						hc.ui.showMessage( hc.loc.getText('error_required_empty'),'error');
						$form.trigger('error', []);
					}
				}else{
					processing = true;
				}

				if(success)
					$form.trigger('submitting', []);

				return success;
			},onResponse:function(rst){
				processing =false;
				var frm = this;


				if(rst.id){
					
					hc.ui.showMessage( hc.loc.getText('record_saved') ,'success',5000 );

					if(!self.id){
						self.id = rst.id;
						var url = self.apiPathPrefix +'/'+self.id+'/edit';
						
						$scope.find('input[name=id]',frm).val( self.id);
						
						self.updateStatus();

						History.pushState( null,null, url);
					}
				}
				
				if(rst.error && rst.error.message){	
					hc.ui.showMessage( rst.error.message,'error' );
				}

				$form.trigger('response', [rst]);

				if(hc.auth.isResultRestrict(rst)){

					return hc.auth.handleLogin(function(){
						self.submit();
					});
				}


			},onError:function(){
				processing =false;
				hc.ui.showMessage( hc.loc.getText('error_cannot_save'),'error' );
				$form.trigger('error', []);
			},onTimeout : function(){

				processing =false;
				hc.ui.showMessage( hc.loc.getText('error_timeout'),'error' );
				$form.trigger('error', []);
			}
		};

		if(this.options.iframe){
			$form.ifrm(formConfig);
		} else{

			$form.on('submit', function(evt){
				evt.preventDefault();
				var success = formConfig.onSubmit.apply( $form.get(0) ,[]);
				if(success){
					$.ajax({
						url: self.getURL(), 
						data: self.getData(), 
						type: 'post',
						dataType: 'json',
						success: function(rst){
							formConfig.onResponse.apply( $form.get(0), [rst] );
						},
						error : function(){
							formConfig.onError.apply( $form.get(0),[]);
						}
					});
				}
			});

		}

	},

	getURL: function(){
		var self = this;
		var $form = self.$form;
		var out = $form.prop('action')
		if(!this.options.iframe){
			out +='.json';
		}

		if(self.options.getURL) out = self.options.getURL.apply(self, [self.$form]);

		return out;
	},

	getData: function(){
		var self = this;
		var $form = self.$form;
		var out = $form.serialize();
		if(self.options.getData) out = self.options.getData.apply(self, [self.$form]);

		return $form.serialize();
	},

	submit: function(){
		var self = this;
		if(typeof window.tinyMCE != 'undefined')
			tinyMCE.triggerSave();
		self.$form.submit();
	},

	publish : function(){
		var self = this;
		if(self.id){
			$.post(self.apiPathPrefix +'/batch/publish','ids='+self.id, function(rst){
				if(rst.data){
					hc.ui.showMessage( hc.loc.getText('record_published') ,'success',5000 );
				}
			},'json');
		}
	},

	updateStatus: function(){
		var self = this;
		var $scope = self.$scope;
		if(self.id){
			$scope.find('.record-editor [re-visible=edit]').removeClass('hidden');
			$scope.find('.record-editor [re-hidden=edit]').addClass('hidden');
			$scope.find('.visible-edit').removeClass('hidden');
			$scope.find('.hidden-edit').addClass('hidden');
		}else{
			$scope.find('.record-editor [re-visible=edit]').addClass('hidden');
			$scope.find('.record-editor [re-hidden=edit]').removeClass('hidden');
			$scope.find('.visible-edit').addClass('hidden');
			$scope.find('.hidden-edit').removeClass('hidden');
		}
	}
};
RecordEditor.prototype = editorPrototype;
RecordEditor.defaults = {
	text:null,
	iframe: false,
	getURL: null,
	getData: null
};


if(typeof window.hc == 'undefined') window.hc = {};
if(typeof window.hc.ui == 'undefined') window.hc.ui = {};
hc.ui.RecordEditor = RecordEditor;
//window.hc.editor = editor;


$.fn.recordEditor = function(options){
	var args = arguments;
	var c = 'each';
	var dataKey = 'record-editor';

	if(args.length > 0 && typeof args[0] != 'object' || args.length == 0){
		var $elm = $(this).eq(0);
		if($elm.length){
			var editor = $elm.data(dataKey);
			if(editor) {
				return editor.handleArgument.apply(this, args);
			}
		}
	}

	return $(this)[c](function(){
		var elm = this;
		var $elm = $(elm);

		var editor = $elm.data(dataKey);

		if(editor){
			return editor.handleArgument.apply(this, args);
		}
		editor = new RecordEditor($elm, $.extend({}, options, RecordEditor.defaults));

		$elm.data(dataKey, editor);
	});
};


})(jQuery);
/*
* HDV Components
*/
;(function(hc, $){


var RecordRow = function(elm, rrId, dataRow, options){

	var $elm = $(elm);
	var self = this;
	this.rrId = rrId;
	this.elm = elm;
	this.$elm = $elm;
	this.options = options;
	
	var $rowElm = $elm;
	
	var _checked = false;

	function getData(field){


		if( typeof field == 'undefined') return dataRow;
		//console.log(dataRow, field);
		var row = dataRow;
		if(typeof dataRow[field] != 'undefined'){
			return dataRow[field];
		}

		if(field!= ''){
			try{
				return eval(field);
			}catch(err){}
			return null;
		}
		return null;
	}

	function setData(newData){
		dataRow = newData;
		update();

		return self;
	}


	function update(){

		if(typeof options.beforeUpdate == 'function'){
			options.beforeUpdate.apply(self, [$rowElm, dataRow])
		}
		hc.ui.ElementParser($rowElm, getData);
		if(typeof options.afterUpdate == 'function'){
			options.afterUpdate.apply(self, [$rowElm, dataRow])
		}

		return self;
	}

	$rowElm.prop('id', 'rr-'+rrId).data('rr-id', rrId).on('click','td,th',function(evt){

		if($rowElm.hasClass('disabled')){
			return;
		}

		var $tar = $(evt.target);
		if($tar.is('.btn,.btn-link,a,.label,.dropdown')) return;
		if($tar.parents('.btn,a,.label,.dropdown').length>0) return;
		evt.preventDefault();
		
		self.toggleChecked();
	});
	$rowElm.find('input[type=checkbox]').val(rrId);
	if(dataRow.is_image){
		$rowElm.find('.thumbnail').css('background-image','url('+ dataRow.image.thumbnail +')');
	}

	if(typeof options.parseRow == 'function'){
		options.parseRow.apply(self, [$rowElm, dataRow])
	}

	
	var $btnSelect = $rowElm.find('.btn-select');
	var $icon = $rowElm.find('.btn-select i');

	this.getDisabled = function(){
		return $rowElm.hasClass('disabled');
	};

	this.setDisabled = function(newVal){
		if(newVal){
			$rowElm.addClass('disabled');
		}else{
			$rowElm.removeClass('disabled');
		}

		if(typeof options.onDisabledStateChange == 'function'){
			options.onDisabledStateChange.apply(this,null);
		}
		
		return self;
	};

	this.getChecked= function(){
		return _checked;
	};
	
	this.setChecked= function(newVal){
		_checked = newVal;
		$icon.removeClass().addClass('fa');
		if(newVal){	
			$rowElm.addClass('active');
			$icon.addClass($icon.data('active'));
			$btnSelect.addClass('btn-success');
		}else{
			$rowElm.removeClass('active');
			$icon.addClass($icon.data('deactive'));
			$btnSelect.removeClass('btn-success');
		}
		if(typeof options.onCheckedStateChange == 'function'){
			options.onCheckedStateChange.apply(self,null);
		}
		return self;
	};


	this.toggleChecked= function(){
		self.setChecked ( !_checked );
		
		return self;
	};
	this.getData = getData;
	this.update = update;
	this.setData = setData;

	update();
	$rowElm.data('record-row', self);
};
	
var _rr_counter = 0;
RecordRow.createID = function(){
	var rrId = 'RR'+(_rr_counter++);
	return rrId;
};

var RecordList = function(elm, options ){
	var self = this;
	self.options=  options;

	var $elm = $(elm);
	self.$elm = $elm;
	
	var bridge = null;
	
	var limit = options.limit;
	var offset = options.offset;
	var total = 0;
	var queries = !options.queries ? {} : options.queries;

	var _selector_select_all_button = '.btn-toggle-select-all:not(.disabled),[rl-toggle-select-all]:not(.disabled)';
	
	var _rrIds = [];
	var _rr_new_ids = {};
	var _rr_mapping = {};
	var _rr_data = {};
	var _rr_data_map = {};
	var _rr_elm_map = {};
	var _rr_parameters = {};
	var _rr_selected_ids = [];
	
	var _selected_counter = 0;
	var _selected_all_current = false;


	var _enable_multiple = false;

	function _error (){
		if(typeof options.onError == 'function'){
			options.onError.apply(self, arguments);
		}else if(arguments.length>0 ){

			alert('Error: '+ arguments[0]);
		}else{
			alert('Unknown error.');
		}
	}

	function updateSelectAllButton(){

		$elm.find(_selector_select_all_button).each(function(){
			var $btn = $(this);
			var $icon = $btn.find('> i');
			if(!_selected_all_current){
				$btn.removeClass('active');
				$icon.removeClass( $icon.data('active') ).addClass( $icon.data('deactive')  );
			}else{
				$btn.addClass('active');
				$icon.removeClass( $icon.data('deactive') ).addClass( $icon.data('active')  );
			}

		});
	}

	function selectCurrent(){
		_selected_all_current = true;
		for(var i=0; i< _rrIds.length; i ++){
			var rr_id = _rrIds[i];

			var row = getRowElmByRRID( rr_id );
			if(row){
				row.setChecked ( true);
			}
		}
		updateSelectAllButton();
	}

	function deselectCurrent(){
		_selected_all_current = false;
		for(var i=0; i< _rrIds.length; i ++){
			var rr_id = _rrIds[i];
			var row = getRowElmByRRID( rr_id );
			if(row){
				row.setChecked ( false);
			}
		}
		updateSelectAllButton();
	}

	function getRowElmByDataID (dataId){

		var _rrId = _rr_data_map [ dataId ];
		return typeof _rr_elm_map [ _rrId ] != 'undefined' ? _rr_elm_map [ _rrId ] : null;

	}

	function updateRowElmByDataID(dataId, newData){
		if(typeof _rr_data_map[dataId] == 'undefined') return;
		var rrId = _rr_data_map[dataId];
		var rowElm = getRowElmByRRID( rrId );
		if(rowElm){
			if(newData){
				newData._rrId = rrId;
				_rr_data_map[dataId] = newData;
				rowElm.setData(newData);
			}else{
				rowElm.update();
			}
		}
	}

	function getRowElmByRRID(rrId){
		if(typeof _rr_elm_map[rrId] != 'undefined')
			return  _rr_elm_map[rrId ];
		return null;
	}

	function getRowByDataID(dataId){
		if(typeof _rr_data_map[dataId] != 'undefined'){
			var rrId = _rr_data_map[dataId];
			return _rr_data[ rrId ];
		}
		return null;
	}

	function getRows(){
		return _rr_data;
	}

	function doBatch(action, data, ids){
		if(!ids) ids = _rr_selected_ids;
		var _ids = [];
		for(var i = 0 ; i < ids.length; i ++){
			/*
			var _rrId = ids[i];
			if(typeof _rr_data[ _rrId ] != 'undefined'){
				_ids.push( _rr_data[_rrId].id );
			}
			//*/
			_ids.push(ids[i]);
		}

		if( typeof options.onBatch == 'function'){
			return options.onBatch.apply(self, [action, _ids, data]);
		}
		return false;
	}

	function doRowAction(action, elm, rrId){

		var row_id = null;
		if(typeof _rr_data[ rrId ] != 'undefined'){
			row_id = _rr_data[rrId].id;
		}
		

		if( typeof options.onRowAction == 'function'){
			return options.onRowAction.apply(self, [action, elm, row_id]);
		}
		return false;
	}
	
	var $template = $(options.containerSelector+ ' .template',$elm);
	var $empty = $(options.containerSelector+ ' .empty',$elm);

	$template.remove();
	if($empty.length)
		$empty.remove();


	function updateAfterSelectedItemChange (){

		if( _selected_counter <1 ){

			if(options.selectorSend!=null){
				$(options.selectorSend).addClass('disabled').prop('disabled',true);
			}
			if($elm.attr('rl-select-button') != '' && typeof $elm.attr('rl-select-button') != 'undefined'){
				$(  $elm.attr('rl-select-button')).addClass('disabled').prop('disabled',true);
			}
	
			$('.btn-rr-select').addClass('seletcted').prop('disabled',true);
		}else{

			if(options.selectorSend!=null){
				$(options.selectorSend).removeClass('disabled').prop('disabled',false);
			}
			if($elm.attr('rl-select-button') != '' && typeof $elm.attr('rl-select-button') != 'undefined'){
				$(  $elm.attr('rl-select-button')).removeClass('disabled').prop('disabled',false);
			}
	
			$('.btn-rr-select').removeClass('seletcted').prop('disabled',false);
		}
		//console.log('Total :'+_selected_counter, _rr_selected_ids);
	}

	function addSelectedDataId( dataId ){
		if(!dataId) return;
		var offset = $.inArray(dataId, _rr_selected_ids);
		if(offset<0){
			_rr_selected_ids.push( dataId );
			_selected_counter  ++;
		}
		updateAfterSelectedItemChange();
		//console.log(dataId, _rr_selected_ids);
	}

	function removeSelectedDataId( dataId ){
		if(!dataId) return;
		var offset = $.inArray(dataId, _rr_selected_ids);
		if(offset>=0){
			_selected_counter  --;
			_rr_selected_ids.splice(offset,1);
		}
		updateAfterSelectedItemChange();
		//console.log(dataId, _rr_selected_ids);
	}

	function getSelectedIds(){
		return _rr_selected_ids;
	}

	function createElement(dataRow){

		if($template.length<1)
			throw new Error('$template is empty.');
		
		var rrId = null;
		if(!dataRow.id || !_rr_mapping[ dataRow.id ]){
			rrId = RecordRow.createID();
		}
		if(!dataRow.id){
			_rr_new_ids[ rrId ] = true;
		}else if(!_rr_mapping[ dataRow.id ]){
			_rr_mapping[ dataRow.id ] = rrId;
		}else{
			rrId = _rr_mapping[ dataRow.id ];
		}
		dataRow._rrId = rrId;
		
		if(dataRow.id)
			_rr_data_map [ dataRow.id ] = rrId;
		_rr_data [ rrId ] = dataRow;
		_rr_parameters [ rrId ] = typeof dataRow.parameters != 'undefined' ? dataRow.parameters : {};
		_rrIds.push( rrId );

		var $rowElm = $template.eq(0).clone();
		$rowElm.removeClass('template').addClass('rr');

		// append to container
		$elm.find(options.containerSelector).append($rowElm);

		var rrObj = new RecordRow($rowElm, rrId, dataRow, {
			onCheckedStateChange: function(){
				var data = this.getData();

				if(this.getChecked()){

					addSelectedDataId( data.id) ;
				}else{
					removeSelectedDataId( data.id );
					if(_selected_all_current){
						_selected_all_current = false;
						updateSelectAllButton();
					}
				}
			},
			beforeUpdate: options.onRowBeforeUpdate,
			afterUpdate: options.onRowAfterUpdate
		});

		if( $.inArray( dataRow.id, _rr_selected_ids) >= 0) {
			rrObj.setChecked(true);
		}

		if( typeof options.onRowCreate == 'function'){
			options.onRowCreate.apply( self, [rrObj, dataRow]);
		}

		_rr_elm_map[ rrId ] = rrObj;

		return rrObj;
	}

	function select(ids){
		//console.log(self, 'select',ids);

		$(ids).each(function(idx, id){

			addSelectedDataId(id);
			var rr = getRowElmByDataID(id);
			if( rr ) rr.setChecked(true);
		});
		//console.log(self, 'deselect',_rr_selected_ids);
		return self;
	}

	function deselect(ids){
		//console.log(self, 'deselect',ids);

		$(ids).each(function(idx, id){
			removeSelectedDataId(id);
			var rr = getRowElmByDataID(id);
			if( rr ) rr.setChecked(false);
		});

		//console.log(self, 'deselect',_rr_selected_ids);
		return self;
	}
	
	function updatePaging(){
		
		if(offset <= 0 ){
			$elm.find('.pager .previous, .pagination .previous').addClass('disabled');
		}else{
			$elm.find('.pager .previous, .pagination .previous').removeClass('disabled');
		}
		var nextIndex = offset + limit;
		if( nextIndex >= total ){
			$elm.find('.pager .next, .pagination .next').addClass('disabled');
		}else{
			$elm.find('.pager .next, .pagination .next').removeClass('disabled');
		}
		
		$elm.find('.pagination .paging-total').text( total );
		$elm.find('.pagination .paging-offset-start').text( Math.min ( total, offset + 1));
		$elm.find('.pagination .paging-offset-end').text( Math.min ( total,nextIndex));


		if(typeof options.onUpdatePaging == 'function'){
			options.onUpdatePaging.apply(self, [offset, total]);
		}
	}
	
	function updateToolbar(){
		if(bridge) bridge.onReload();
		var noRecord = _selected_counter < 1;
		$elm.find('.btn-rr-select,.btn-selected-action')
			.prop('disabled',noRecord)
			.button(noRecord ? 'disable':'enable' );

		if(typeof options.onUpdateToolbar == 'function'){
			options.onUpdateToolbar.apply(self, [_selected_counter]);
		}
	}

	function handleAfterReload(rst){
		$elm.find('[rl-text]').each(function(){
			var $elm = $(this);
			var q = $(this).attr('rl-text');
			var val = null;
			if(q && q.length>0){
				try{
					val = eval(q);
				}catch(exp){}
			}
			if(val){
				$elm.text(val);
			}
		}).find('[rl-html]').each(function(){
			var $elm = $(this);
			var q = $(this).attr('rl-html');
			var val = null;
			if(q && q.length>0){
				try{
					val = eval(q);
				}catch(exp){}
			}
			if(val){
				$elm.html(val);
			}
		}).find('[rl-value]').each(function(){
			var $elm = $(this);
			var q = $(this).attr('rl-value');
			var val = null;
			if(q && q.length>0){
				try{
					val = eval(q);
				}catch(exp){}
			}
			if(val){
				$elm.val(val);
			}
		});
	}

	function parse(rst){

		if(hc.auth.isResultRestrict(rst)){
			return hc.auth.handleLogin(reload);
		}
		clearRows();


		if(typeof options.afterSearch == 'function'){
			options.afterSearch.apply(self, [lastQueryURL,lastQueryData,rst]);
		}
		
		updateToolbar();


		var newRst = rst;
		if(typeof options.onParse == 'function'){
			newRst = options.onParse.apply(self, [lastQueryURL,lastQueryData,rst]);
			
		}

		if(newRst) 
			rst = newRst;
		
		if(rst.data){

			if(typeof rst.paging != 'undefined'){
				offset = parseInt(rst.paging.offset);
				limit = parseInt(rst.paging.limit);
				total = parseInt(rst.paging.total);
				
				updatePaging();
			}

			handleAfterReload(rst);

			if($empty.length)
				$empty.remove();
			
			var counter = 0;
			for(var i = 0 ; i < rst.data.length; i ++){
				var rrObj = createElement( rst.data[i]);
				if(rrObj.getChecked()){
					counter ++;
				}
			}

			// if empty row is available
			if(rst.data.length < 1 && $empty.length){
				$elm.find(options.containerSelector).append($empty);
			}

			if( counter >= limit){
				_selected_all_current = true;
				updateSelectAllButton();
			}

		}else if(rst.error && rst.error.message){
			_error(rst.error.message);
		}

	}

	function clearRows(){
		$elm.find('.rr').remove();

		_selected_all_current = false;
		updateSelectAllButton();
		_rrIds.length = 0;
		_rr_data_map = {};
		_rr_elm_map = {};
	}

	var $lockedUI = null;
	var lastQueryURL = null;
	var lastQueryData = null;

	var loader = null;
	function reload(){

		if(loader) {
			loader.abort();
			loader = null;
		}

		var acceptingParams = options.acceptingParams;
		var queryParams = options.queryParams;
		var _queries = {};
		var _urlParams = {};

		if(!queryParams) queryParams = acceptingParams;

		
		for(var i = 0 ; i < acceptingParams.length; i ++)
			if(typeof queries[ acceptingParams[i] ] != 'undefined')
				_urlParams[ acceptingParams[i] ] = queries[ acceptingParams[i] ];

		for(var i = 0 ; i < queryParams.length; i ++)
			if(typeof queries[ queryParams[i] ] != 'undefined')
				_queries[ queryParams[i] ] = queries[ queryParams[i] ];
			
		if(!_queries.offset || _queries.offset < 0)
			_queries.offset = 0;
		_queries.offset = parseInt(_queries.offset);
		if(!_queries.limit || _queries.limit < 1)
			_queries.limit = 25;
		_queries.limit = parseInt(_queries.limit);
		
		var $lockedUI = $elm.find('.btn:not(.disabled), .pagination li:not(.disabled) a, .pager li:not(.disabled) a');
		$lockedUI.addClass('disabled');

		lastQueryURL = options.searchURL;
		lastQueryData = _urlParams;

		var cfg = typeof options.searchOption == 'function' ? options.searchOption.apply(self, [_queries]) : {url: options.searchURL, data: _queries, dataType:'json'};
		cfg.error = function(){
			$elm.addClass('rl-loading');
			$elm.removeClass('rl-error');
			loader = null;

			$lockedUI.removeClass('disabled');
			if(typeof options.afterSearch == 'function'){
				options.afterSearch.apply(self, [lastQueryURL,lastQueryData,null]);
			}

			if($empty.length)
				$elm.find(options.containerSelector).append($empty);

		};
		cfg.success = function(rst){
			$elm.removeClass('rl-error');
			$elm.removeClass('rl-loading');
			loader = null;
			$lockedUI.removeClass('disabled');
			parse(rst);
		};

		if(typeof options.beforeSearch == 'function'){
			options.beforeSearch.apply(self, [lastQueryURL,lastQueryData, cfg]);
		}
		$elm.removeClass('rl-error');
		$elm.addClass('rl-loading');
		loader = $.ajax(cfg);
	}
	
	function send(){
		if(bridge){
			if(bridge.send()){
				window.close();
			}
		}
	}

	var initialType = null;

	if(options.selectorSend!=null){
		$(options.selectorSend).on('click', function(){
			send();
		});
	}
	if($elm.attr('rl-select-button') != '' && typeof $elm.attr('rl-select-button') != 'undefined'){
		$(  $elm.attr('rl-select-button')).on('click', function(){
			send();
		});
	}
	
	$('body').on('click','.btn-rr-select,[rr-select]', function(evt){
		evt.preventDefault();
		send();
	});
	$elm.on('click','.btn-reload,[rl-reload]:not(.disabled)',function(){
		reload();
	}).on('click',_selector_select_all_button,function(){
		if( !_selected_all_current ){
			selectCurrent();
		}else{
			deselectCurrent();
		}
	}).on('click','.btn-rr-select:not(.disabled),[rl-send]:not(.disabled)',function(){
		send();
	}).on('click','.btn-selected-action a:not(.disabled)', function(){
		var data = $(this).data();
		var action = data.action;

		doBatch(action, data);
	}).on('change','.searchbar .search-order input',function(){

		queries.direction = $(this).val();
		
		if(typeof options.queryUpdate == 'function') options.queryUpdate.apply(self, [queries]);
		else reload();
	}).on('submit','.searchbar', function(evt){
		evt.preventDefault();
		
		var keywordStr = $elm.find('.searchbar input[name=q]',this).val();
		if(keywordStr && keywordStr.length>0){
			queries.q = keywordStr;
		}else{
			queries.q = null;
		}
		queries.offset=0;
		
		if(typeof options.queryUpdate == 'function') options.queryUpdate.apply(self, [queries]);
		else reload();
	}).on('click','.pager .previous:not(.disabled) a, .pagination .previous:not(.disabled) a',function(evt){
			evt.preventDefault();
		offset -= limit;
		if(offset < 0 )
			offset = 0;
		queries.offset = offset;

		if(typeof options.queryUpdate == 'function') options.queryUpdate.apply(self, [queries]);
		else reload();
	}).on('click','.pager .next:not(.disabled) a, .pagination .next:not(.disabled) a',function(evt){
		evt.preventDefault();
		if(offset + limit < total){
			offset += limit;
			queries.offset = offset;

			if(typeof options.queryUpdate == 'function') options.queryUpdate.apply(self, [queries]);
			else reload();
		}
	}).on('click',options.containerSelector +' .rr .btn-select:not(.disabled)', function(evt){
		var $btn = $(this);
		var $rowElm = $btn.parents('.rr');
		
		var rrObject = $rowElm.data('record-row');
		var rrId = $rowElm.data('rr-id');
		
		rrObject.toggleChecked();
		
		updateToolbar();
			evt.preventDefault();
	}).on('click', options.containerSelector +' .rr *[rc-action]:not(.disabled)', function(evt){
		var $btn = $(this);
		var data = $btn.data();
		var action = $btn.attr('rc-action');
		var $rowElm = $btn.parents('.rr');
		
		var rrObject = $rowElm.data('record-row');
		var rrId = $rowElm.data('rr-id');
		
		if(doRowAction(action, this, rrId)){
			evt.preventDefault();
		}
	}).on('change', '[name=sort]', function(evt){
		evt.preventDefault();
		var $select = $(this);

		queries.sort = $select.val();
		if(typeof options.queryUpdate == 'function') options.queryUpdate.apply(self, [queries]);
		else reload();
	});
	
	$elm.on('click',options.containerSelector +' .rr .rc-hide', function(){
		var $btn = $(this);
		var $rowElm = $(this).parents('.rr');
		$rowElm.remove();
	});

	this.createElement = createElement;
	this.updatePaging = updatePaging;
	this.updateToolbar = updateToolbar;
	this.reload = reload;
	this.select = select;
	this.deselect = deselect;
	this.getRows = getRows;
	this.getRowByDataID = getRowByDataID;
	this.getRowElmByDataID = getRowElmByDataID;
	this.getRowElmByRRID = getRowElmByRRID;
	this.updateRowElmByDataID =  updateRowElmByDataID;

	this.selectCurrent = selectCurrent;
	this.deselectCurrent = deselectCurrent;
	this.getSelectedIds = getSelectedIds;
	this.getQuery = function(){
		return queries;
	}
	this.setQuery = function(newVal){
		queries = newVal;
	}
	this.getBridge = function(){
		return bridge;
	};
	this.handleArgument = function(method){
		if(arguments.length < 1) return self;
		var args = []; for(var i = 1; i < arguments.length; i ++) args.push(arguments[i]);
		if(method && typeof self[method] == 'function'){
			return self[method].apply(self,args);
		}
	};
	this.setTemplate = function(c){
		$template = $(c);
		return self;
	}
	this.setEmpty = function(c){
		$empty = $(c);
		return self;
	}
	this.addQueryField = function(name){
		if($.isArray(name)){
			$(name).each(function(idx, val){ self.addQueryField(val); });
			return self;
		}
		options.acceptingParams.push(name);
		options.queryParams.push(name);
		return self;
	};

	bridge = new SelectorBridge();
	_enable_multiple = bridge.multiSelect = options.selectorMultiple || options.selectorMultiple == 'yes';
	bridge.getIds = function(){
		return _rr_selected_ids;
	}
	bridge.onSelectTooMuch = function(){
		hc.ui.showMessage( hc.loc.getText('error_select_too_much') , 'error');
	}
	bridge.onUpdate = function(){
		$elms = $elm.find('.rr');
		$elms.each(function(idx,$elm){
			var checked = $.inArray($elm.recordRow('getData').id , bridge.ids) >= 0;
			$elm.recordRow('setChecked',checked);
		});
	}
	bridge.onReload = function(){
		bridge.ids = bridge.getIds();
	}

	if(options.selectorValue){
		var _sv = $.isArray(options.selectorValue) ? options.selectorValue : options.selectorValue.replace(/[\s\t\r\n]*/,'').split(',');
		$(_sv).each(function(idx, id){
			addSelectedDataId( id);
		});
	}

	if(options.extraParams){
		this.addQueryField(options.extraParams);
	}

	if(options.selectorCallback){
		bridge.connect(options.selectorCallback);
	}

	var reloadFirst = true;
	if(typeof options.onInit == 'function'){
		reloadFirst = options.onInit.apply(self,null);
	}

	updateAfterSelectedItemChange();
	if(reloadFirst)
		reload();

};


$.recordList = {
	defaults: {
		selectorCallback: null,
		selectorValue: null,
		selectorMultiple: null,
		selectorValue: null,
		selectorSend: null,

		dataRowId: 'id',
		dataRowTitle: 'title',

		containerSelector: '.table tbody',

		onInit: null,
		onRowCreate: null,
		onRowAction: null,
		onRowBeforeUpdate: null,
		onRowAfterUpdate: null,
		onBatch: null,

		remote:true,
		searchURL: '',
		searchOption: null, // callback function
		beforeSearch: null, // callback function
		afterSearch: null, // callback function

		queryUpdate:null, // callback function

		offset: 0,
		limit: 25,
		queries: null,

		acceptingParams: [
			'offset','limit','sort','direction','q','status','type','_modalIns','dialog','callback'
		],

		queryParams: [
			'offset','limit','sort','direction','q','status','type'
		]
	}
};
$.recordRow = {
	defaults: {
		beforeUpdate: null,
		afterUpdate:null,
		onCheckedStateChange:null
	}
};
$.fn.recordList = function(options){
	var args = arguments;
	var c = 'each';
	var dataKey = 'record-list';

	if(args.length > 0 && typeof args[0] != 'object' || args.length == 0){
		var $elm = $(this).eq(0);
		if($elm.length){
			var r = $elm.data(dataKey);
			if(r) {
				return r.handleArgument.apply(this, args);
			}
		}
	}
	return $(this)[c](function(){
		var elm = this;
		var $elm = $(elm);

		var list = $elm.data(dataKey);

		if(list){
			return list.handleArgument.apply(this, args);
		}
		list = new RecordList($elm, $.extend({}, $.recordList.defaults, options));

		$elm.data(dataKey, list);
	});
};

$.fn.recordRow = function(options){
	var args = arguments;
	var c = 'each';
	var dataKey = 'record-row';

	if(args.length > 0 && typeof args[0] != 'object' || args.length == 0){
		var $elm = $(this).eq(0);
		if($elm.length){
			var r = $elm.data(dataKey);
			if(r) {
				return r.handleArgument.apply(this, args);
			}
		}
	}
	return $(this)[c](function(){
		var elm = this;
		var $elm = $(elm);

		var r = $elm.data(dataKey);

		if(r){
			return r.handleArgument.apply(this, args);
		}
		r = new RecordRow($elm, $.extend({}, $.recordRow.defaults, options));

		$elm.data(dataKey, r);
	});
};

})(hc, jQuery);
;(function(exports,$){
var VGCore = function(options){
	this.visible = false;
	this.initialize.apply(this,arguments);
};
VGCore.prototype.el = null;
VGCore.prototype.options = null;
VGCore.prototype.visible = false;
VGCore.prototype.initialize = function(opts){
	this.el = opts.el;
	this.options = opts;
	this.target = opts.target;
	this.scope = opts.scope;
	this.bindElm();
	this.update();
};
VGCore.prototype.bindElm = function(){
	var self = this;
	var $target = self.options.scope ? $(this.target,self.options.scope) : $(this.target);
	self.$target = $target;
	$target.on('change',function(){
		self.update();
	});
};
VGCore.prototype.update = function(){};

var VGSelect = function(opts){
	this.type = 'select';
	this.value = opts.value;
	this.initialize.apply(this,arguments);
};	
VGSelect.prototype =$.extend({}, VGCore.prototype);
VGSelect.prototype.update = function(){
	var self = this;
	this.visible = self.$target.find('option[value='+this.value+']').is(':selected');
	if(typeof this.options.onUpdate == 'function'){
		this.options.onUpdate.apply(this, []);
	}
};

var VGCheckbox = function(opts){
	this.type = 'checkbox';
	this.target = opts.target;
	this.initialize.apply(this,arguments);
};
VGCheckbox.prototype =$.extend({}, VGCore.prototype);
VGCheckbox.prototype.initialize = function(opts){
	this.el = opts.el;
	this.options = opts;
	this.target = opts.target;
	this.scope = opts.scope;
	this.bindElm();
	this.update();
};
VGCore.prototype.bindElm = function(){
	var self = this;
	var $target = self.options.scope ? $(this.target,self.options.scope) : $(this.target);
	self.$target = $target;
	$target.on('change',function(){
		self.update();
	});
};
VGCheckbox.prototype.update = function(){
	var $target = self.options.scope ? $(this.target,self.options.scope) : $(this.target);
	this.visible = $target .is(':checked');
	if(typeof this.options.onUpdate == 'function'){
		this.options.onUpdate.apply(this, []);
	}
};

exports.VGCore = VGCore;
exports.VGCheckbox = VGCheckbox;
exports.VGSelect = VGSelect;

exports.modules.push(function($scope){

	$scope.find('[vg-select],[vg-checked]').each(function(){
		var $el = $(this);
		var list = [];
		var onUpdate = function(){
			var counter = 0;
			
			$(list).each(function(idx, checker){
				if(checker.visible) counter++;
			});
			
			if( counter >= list.length){
				$el.show();
			}else{
				$el.hide();
			}
		};
		if($el.attr('vg-select')!=null){
			list.push(new VGSelect({scope: $scope, el: $el,target: $el.attr('vg-select') ,value:$el.attr('vg-select-value'),onUpdate: onUpdate}));
		}
		if($el.attr('vg-checked')!=null){
			list.push(new VGCheckbox({scope: $scope, el: $el,target: $el.attr('vg-checked'),onUpdate: onUpdate}));
		}
		onUpdate();
	});
});


})(hc.ui,jQuery);