const API_URL = 'http://localhost:3000/usuarios';

let usuarioLogado = null;

// Login
async function fazerLogin() {
    const user = document.getElementById('loginUser').value;
    const senha = document.getElementById('loginSenha').value;

    const res = await fetch(API_URL);
    const usuarios = await res.json();

    const usuario = usuarios.find(u => u.usuario === user && u.senha === senha);

    if (usuario) {
        usuarioLogado = usuario;
        document.getElementById('login').classList.add('hidden');
        document.getElementById('cadastro').classList.add('hidden');
        document.getElementById('painel').classList.remove('hidden');
        document.getElementById('bemVindo').innerText = `Bem-vindo, ${usuario.usuario} (${usuario.funcao})`;
        exibirDados();
    } else {
        alert('Usuário ou senha inválidos');
    }
}

// Cadastro
async function cadastrarUsuario() {
    const user = document.getElementById('cadUser').value;
    const email = document.getElementById('cadEmail').value;
    const senha = document.getElementById('cadSenha').value;
    const funcao = document.getElementById('cadFuncao').value;

    const res = await fetch(API_URL);
    const usuarios = await res.json();

    if (usuarios.some(u => u.usuario === user)) {
        alert('Usuário já existe!');
        return;
    }

    const novoUsuario = { usuario: user, email, senha, funcao };

    await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(novoUsuario)
    });

    alert('Usuário cadastrado com sucesso!');
}

// Exibir dados
async function exibirDados() {
    const res = await fetch(API_URL);
    const usuarios = await res.json();

    const tabelaDiv = document.getElementById('tabelaUsuarios');
    const dadosDiv = document.getElementById('dadosUsuario');

    let tabelaHTML = '<table><tr><th>Usuário</th><th>Função</th>';

    if (usuarioLogado.funcao === 'ADM') {
        tabelaHTML += '<th>Ações</th>';
    }

    tabelaHTML += '</tr>';

    usuarios.forEach(u => {
        if (usuarioLogado.funcao === 'ADM') {
            tabelaHTML += `<tr><td>${u.usuario}</td><td>${u.funcao}</td>
            <td><button onclick="editarUsuario(${u.id})">Editar</button>
            <button onclick="deletarUsuario(${u.id})">Excluir</button></td></tr>`;
        } else if (usuarioLogado.funcao === 'Supervisor') {
            tabelaHTML += `<tr><td>${u.usuario}</td><td>${u.funcao}</td></tr>`;
        }
    });

    tabelaHTML += '</table>';

    if (usuarioLogado.funcao === 'Especialista' || usuarioLogado.funcao === 'Supervisor') {
        dadosDiv.innerHTML = `
        <h3>Seus Dados</h3>
        <p>Usuário: ${usuarioLogado.usuario}</p>
        <p>Email: ${usuarioLogado.email}</p>
        <p>Função: ${usuarioLogado.funcao}</p>
        <button onclick="editarUsuario(${usuarioLogado.id})">Editar Meus Dados</button>`;
    } else {
        dadosDiv.innerHTML = '';
    }

    tabelaDiv.innerHTML = tabelaHTML;
}

// Editar
async function editarUsuario(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const user = await res.json();

    const novoUsuario = prompt('Novo nome:', user.usuario);
    const novoEmail = prompt('Novo email:', user.email);
    const novaSenha = prompt('Nova senha:', user.senha);
    const novaFuncao = usuarioLogado.funcao === 'ADM' ? prompt('Nova função (ADM, Supervisor, Especialista):', user.funcao) : user.funcao;

    if (novoUsuario && novaSenha) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({usuario: novoUsuario, email: novoEmail, senha: novaSenha, funcao: novaFuncao})
        });
        alert('Usuário atualizado!');
        if (usuarioLogado.id === id) usuarioLogado = {...usuarioLogado, usuario: novoUsuario, email: novoEmail, senha: novaSenha};
        exibirDados();
    }
}

// Deletar
async function deletarUsuario(id) {
    if (confirm('Deseja realmente excluir?')) {
        await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
        alert('Usuário excluído!');
        exibirDados();
    }
}

// Logout
function logout() {
    usuarioLogado = null;
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('cadastro').classList.remove('hidden');
    document.getElementById('painel').classList.add('hidden');
}

