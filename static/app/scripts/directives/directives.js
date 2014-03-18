app.directive('ngBlur', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.bind('blur', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}]);
app.directive('currency',  function() {
  return {
    restrict: 'A',
    require:'?ngModel',
    link: function ($scope, elem, attrs,ngModel) {

        var all_currency=[
                  {"value":"USD" , "symbol":"$"},
                  {"value":"EUR", "symbol":"€"},
                  {"value":"CAD", "symbol":"$"},
                  {"value":"GBP", "symbol":"£"},
                  {"value":"AUD", "symbol":"$"},
                  {"value":"", "symbol":""},
                  {"value":"AED", "symbol":"د.إ"},
                  {"value":"ANG", "symbol":"ƒ"},
                  {"value":"AOA", "symbol":"AOA"},
                  {"value":"ARS", "symbol":"$"},
                  {"value":"BAM", "symbol":"KM"},
                  {"value":"BBD", "symbol":"$"},
                  {"value":"BGL", "symbol":"лв"},
                  {"value":"BHD", "symbol":"BD"},
                  {"value":"BND", "symbol":"$"},
                  {"value":"BRL", "symbol":"R$"},
                  {"value":"BTC", "symbol":"฿"},
                  {"value":"CHF", "symbol":"Fr"},
                  {"value":"CLF", "symbol":"UF"},
                  {"value":"CLP", "symbol":"$"},
                  {"value":"CNY", "symbol":"¥"},
                  {"value":"COP", "symbol":"$"},
                  {"value":"CRC", "symbol":"₡"},
                  {"value":"CZK", "symbol":"Kč"},
                  {"value":"DKK", "symbol":"kr"},
                  {"value":"EEK", "symbol":"KR"},
                  {"value":"EGP", "symbol":"E£"},
                  {"value":"FJD", "symbol":"FJ$"},
                  {"value":"GTQ", "symbol":"Q"},
                  {"value":"HKD", "symbol":"$"},
                  {"value":"HRK", "symbol":"kn"},
                  {"value":"HUF", "symbol":"Ft"},
                  {"value":"IDR", "symbol":"Rp"},
                  {"value":"ILS", "symbol":"₪"},
                  {"value":"INR", "symbol":"₨"},
                  {"value":"IRR", "symbol":"ریال"},
                  {"value":"ISK", "symbol":"kr"},
                  {"value":"JOD", "symbol":"د.ا"},
                  {"value":"JPY", "symbol":"¥"},
                  {"value":"KES", "symbol":"KSh"},
                  {"value":"KRW", "symbol":"₩"},
                  {"value":"KWD", "symbol":"KD"},
                  {"value":"KYD", "symbol":"$"},
                  {"value":"LTL", "symbol":"Lt"},
                  {"value":"LVL", "symbol":"Ls"},
                  {"value":"MAD", "symbol":"د.م."},
                  {"value":"MVR", "symbol":"Rf"},
                  {"value":"MXN", "symbol":"$"},
                  {"value":"MYR", "symbol":"RM"},
                  {"value":"NGN", "symbol":"₦"},
                  {"value":"NOK", "symbol":"kr"},
                  {"value":"NZD", "symbol":"$"},
                  {"value":"OMR", "symbol":"ر.ع"},
                  {"value":"PEN", "symbol":"S/."},
                  {"value":"PHP", "symbol":"₱"},
                  {"value":"PLN", "symbol":"zł"},
                  {"value":"QAR", "symbol":"ر.ق"},
                  {"value":"RON", "symbol":"L"},
                  {"value":"RUB", "symbol":"руб."},
                  {"value":"SAR", "symbol":"ر.س"},
                  {"value":"SEK", "symbol":"kr"},
                  {"value":"SGD", "symbol":"$"},
                  {"value":"THB", "symbol":"฿"},
                  {"value":"TRY", "symbol":"TL"},
                  {"value":"TTD", "symbol":"$"},
                  {"value":"TWD", "symbol":"$"},
                  {"value":"UAH", "symbol":"₴"},
                  {"value":"VEF", "symbol":"Bs F"},
                  {"value":"VND", "symbol":"₫"},
                  {"value":"XCD", "symbol":"$"},
                  {"value":"ZAR", "symbol":"R"}];
          $.each(all_currency, function (i, item) {
            $(elem).append('<option value='+item.value+'>'+item.symbol+ " - "+item.value+'</option>');
          });
     }
}});
app.directive('amount', function() {
    return {
      restrict: 'A',
      require:'?ngModel',
      link: function ($scope, elem, attrs,ngModel) {
        var field=$(elem);
        field.blur(function() {
          var value=$(this).val();
         $(this).val(value.replace(/\./g, ''));     
        });
        field.focus(function() {
          var value=$(this).val();
          $(this).val(numberWithCommas(value));
        });
        field.keyup(function() {
          var value=$(this).val();
          $(this).val(numberWithCommas(value));
        });
        function numberWithCommas(n) {
          var par=n.toString().split(",");
          n=par[0];
          n= n.replace(/\./g, '');
          n=n.replace(/,/g, '');
          var parts=n.toString().split(".");
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (parts[1] ? "," + parts[1] : "");
        }
      }
 }
});
app.directive('ngDrag', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngDrag']);
    element.bind('drag', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}]);
app.directive('ngDrop', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngDrop']);
    element.bind('drop', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}]);
app.directive('draggable', function() {
   return function(scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function(e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function(e) {
                this.classList.remove('drag');
                //alert('end of draggable');
                return false;
            },
            false
        );
        el.addEventListener(
            'drop',
            function(e) {
                // Stops some browsers from redirecting.
                if (e.stopPropagation) e.stopPropagation();

                this.classList.remove('over');

                //var item = document.getElementById(e.dataTransfer.getData('Text'));
                //this.appendChild(item);

                return false;
            },
            false
        );
    }
});
app.directive('droppable', function() {
    return function(scope, element) {
        var el = element[0];
        el.addEventListener(
            'dragover',
            function(e) {
                e.dataTransfer.dropEffect = 'move';
                // allows us to drop
                if (e.preventDefault) e.preventDefault();
                this.classList.add('over');
                return false;
            },
            false
        );
        el.addEventListener(
            'dragenter',
            function(e) {
                this.classList.add('over');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragleave',
            function(e) {
                this.classList.remove('over');
                return false;
            },
            false
        );
    }
});
app.directive('taggable', ['$parse',function($parse) {
    return {
      restrict: 'A',
      require:'?ngModel',
      template: '<input typeahead="tag as tag.name  for tag in getSearchResult($viewValue) | filter:getSearchText($viewValue) | limitTo:8" typeahead-on-select="selectItem(<%=modelName%>)"/>',
      replace: true,

      link: function ($scope, elem, attrs,ngModel) {
        $scope.modelName=attrs.ngModel;
        $scope.attribute='name';
        $scope.currentAttribute='name';
        $scope.objectName='user';
        $scope.tagInfo=$scope[attrs.taggabledata];
        $scope.newTaskValue=null;
        function ReturnWord(text, caretPos) {
              var preText =text, posText =text, wordsBefore=[], wordsAfter=[], pre='', post='';
                preText = preText.substring(0, caretPos);
                wordsBefore= preText.split(" ");
                pre = wordsBefore[wordsBefore.length - 1]; 
                posText = posText.substring(caretPos);
                wordsAfter = posText.split(" ");
                post = wordsAfter[0];
                wordsBefore.splice(wordsBefore.length - 1,1);
                wordsAfter.splice(0,1);
              return {
                before:wordsBefore.join(' '),
                after:wordsAfter.join(' '),
                word:pre+post
              }
          }
        $scope.getSearchText=function(value){
                $scope.pattern=null;
                $scope.newTaskText=$(elem).val();
                $scope.newTaskValue=ReturnWord($(elem).val(),$(elem).caret()).word;
                $scope.matchPattern=false;
                $scope.returnedValue=undefined;
                angular.forEach($scope.tagInfo, function(item){
                     if (item.tag=='#'){$scope.pattern = /^#([\w]*)/g;}
                     if (item.tag=='@') {$scope.pattern = /^@([\w]*)/g;};
                     if (item.tag=='!') {$scope.pattern = /^!([\w]*)/g;};
                     var text=$scope.newTaskValue;
                     if($scope.pattern.test($scope.newTaskValue)){
                          $scope.returnedValue = text.replace($scope.pattern, "$1");
                          $scope.matchPattern=true;
                        }
                    });
                if ($scope.matchPattern) {
                  return $scope.returnedValue;
                }else{
                  return null;
                };  
            }
          $scope.getSearchResult=function(value){
               
                if($scope.getSearchText(value)!=null){
                  var text= ReturnWord($(elem).val(),$(elem).caret()).word;
                  var tag= text.substring(0,1);
                  $scope.datar={};
                  angular.forEach($scope.tagInfo, function(item){
                    if (item.tag==tag) {
                      $scope.data=$scope[item.data.name];
                      $scope.currentAttribute=item.data.attribute;
                      $scope.datar=$scope.data;
                          angular.forEach($scope.datar, function(itm){
                          if (!itm.hasOwnProperty('name')) {
                                    itm.name = itm[$scope.currentAttribute];
                                }
                          }); 
                          $scope.objectName=item.data.name;
                      };
                    });
                  return $scope.datar;
                  }else{
                     return [];
                  }
          }
        $scope.selectItem = function(value){
          angular.forEach($scope.tagInfo, function(item){
              if (item.data.name==$scope.objectName) {
                  if ($scope.currentAttribute!='name') {
                      delete value["value"];
                  };
                  if (item.selected.indexOf(value) == -1) {
                   item.selected.push(value);
                   }

                  var text= ReturnWord($(elem).val(),$(elem).caret()).word;
                  var beforeText= ReturnWord($(elem).val(),$(elem).caret()).before;
                  var afterText= ReturnWord($(elem).val(),$(elem).caret()).after;
                  var tag= text.substring(0,1);
                  $parse(attrs.ngModel).assign($scope, beforeText+' '+tag+value[item.data.attribute]+' '+afterText);
              }; 
           });
           
         };

      }
  }
}]);