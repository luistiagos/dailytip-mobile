angular.module('dailytipMobile', ['ionic'])

    .controller('MapCtrl', function($scope, $ionicLoading, $http) {
		
        var mapOptions = {
          center: new google.maps.LatLng(43.07493,-89.381388),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
          e.preventDefault();
          return false;
        });

        $scope.map = map;
		
		$scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
		  $scope.pCenter = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
          });
          $scope.map.setCenter($scope.pCenter.position);
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
		
		$scope.obterTodosTiposDeEstabelecimento = function(){
		
			$http({method:'GET',url:'http://localhost:8080/dailytip/estabelecimento/obterTodosTipoEstabelecimento'})
			.success(function(data, status, headers, config) {
                 $scope.listaDeEstabelecimento = data;
            });
        }
		
		$scope.obterTodosTiposDeEstabelecimento();	
		
		$scope.buscarPromocoes=function(){
            console.log('Matheus me dá as promocoes!!!!');
            $scope.listaTemplateDetalhesPromocoes = [];
	
            var metros = $scope.pCenter.position.distanceFrom($scope.map.getBounds().getNorthEast());
            var distanciaCentro = (Math.round(metros * 100) / 100);

            var newVar = {latitude:$scope.pCenter.position.lat(),
                longitude:$scope.pCenter.position.lng(),
                km:distanciaCentro,
                tipoEstabelecimento:$scope.tipoEstabelecimento};

            angular.forEach($scope.promoMarkers, function(value, key) {
                value.setMap(null);});
			
			$http({url:'http://localhost:8080/dailytip/estabelecimento/obterPromocoesPor',method:'GET',params:newVar})
			.success(function(ret, status, headers, config) {
                 
				 if(ret && ret.length>0){
					 if($scope.promoMarkers){
                        for(k=0;k<$scope.promoMarkers.length;k++){
                            $scope.promoMarkers[k].setMap(null);
                        }
                    }
					
					for(k=0;k<ret.length;k++){
                        var toPosition = new google.maps.LatLng(ret[k].latitude, ret[k].longitude);
                        var marker = new google.maps.Marker({
                            position: toPosition,
							map:$scope.map
                        });
                        
                        marker.id=k;
                        var imagem = ret[k].promocoes[0].linkImagem;
                        if (imagem == null || imagem == "") {
                        	imagem = "../../images/noimage.jpg";
                        }
                        
                       var estabelecimentoPromocional = 
                        {
                          estabelecimentoId:ret[k].id,
                          promocaoId:ret[k].promocoes[0].id,
                          nomeEstabelecimento:ret[k].nome,
                          tituloPromocao:ret[k].promocoes[0].titulo,
                          imagem:imagem,
                          descricaoAbrev:ret[k].promocoes[0].descricaoAbreviada,
                          descricao:ret[k].promocoes[0].descricao,
                          endereco:ret[k].endereco,
                          complemento:ret[k].complemento,
                          telefone:ret[k].telefone,
                          email:ret[k].email,
                          markId:marker.id
                        };
                        
                        $scope.listaTemplateDetalhesPromocoes.push($scope.estabelecimentoPromocional);
                        
                    }
				 }
            });
        }
    });