obs = obslua

-- Fonction pour démarrer le serveur HTTP
function start_local_server()
    local command = "start npx http-server ../ -p 8080"
    os.execute(command)  -- Utilise Node.js pour démarrer le serveur
end

-- Fonction de script qui se lance quand OBS démarre
function script_description()
    return "Ce script démarre un serveur HTTP local sur le port 8080."
end

function script_load(settings)
    start_local_server()
end