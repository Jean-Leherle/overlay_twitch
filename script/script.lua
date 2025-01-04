obs = obslua

-- Chemin vers le dossier contenant server.exe (à remplacer par le bon chemin)
local base_path = "C:/Users/louis/Documents/test" 
-- Nom de l'exécutable (ne pas modifier)
local server_exe = "/server.exe"

-- Fonction pour lancer le serveur
function start_server()
    local full_server_path = base_path .. server_exe
    obs.script_log(obs.LOG_INFO, "Lancement du serveur à l'emplacement : " .. full_server_path)

    -- Ajouter le chemin du dossier en paramètre pour le serveur
    os.execute('start "" "' .. full_server_path .. '" "' .. base_path .. '/dist' .. '"')
end

-- Fonction appelée au chargement du script
function script_load(settings)
    start_server()
end

-- Fonction appelée à la décharge du script
function script_unload()
    obs.script_log(obs.LOG_INFO, "Script déchargé.")
end
