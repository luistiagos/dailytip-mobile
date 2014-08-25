angular.module('service.estabelecimento', [
    'ngResource'
])
    .service('EstabelecimentoService', ['$resource', 'SERVICE_URL', function ($resource, SERVICE_URL) {
        return $resource(SERVICE_URL + 'estabelecimento/:action', {}, {
            cadastrar: { params: {action: 'salvar'}, method: 'POST'},
            cadastrarTpEstabelecimento: { params: {action: 'cadastrarTipoEstabelecimento'}, method: 'POST'},
            obterEstabelecimentoPorUsuario: { params: {action: 'obterEstabelecimentoPorUsuario'}, method: 'POST', isArray: true},
            obterTiposEstabelecimentos: { params: {action: 'obterTodosTipoEstabelecimento'}, method: 'GET', isArray: true },
            getAll: { params: {action: 'obterTodosTipoEstabelecimento'}, method: 'GET', isArray: true },
            getByLocation: { params: {action: 'obterPromocoesPor'}, method: 'GET', isArray: true}
        });
    }])
;