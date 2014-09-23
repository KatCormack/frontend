#!/usr/bin/env ruby

require 'fog'

stage = ENV['DEPLOYMENT_ENV'] || 'staging'
secrets = JSON.parse(File.read('secrets.json'))

if secrets['rackspace_api_key']
  compute = Fog::Compute.new({
                               :provider => "Rackspace",
                               :rackspace_username => secrets['rackspace_username'],
                               :rackspace_api_key => secrets['rackspace_api_key'],
                               :rackspace_region => secrets['rackspace_region']
                             })
end

servers = []
secrets['deployment_tags'].each do |tag|
  servers += compute.servers.select {|s| s.name.include?(stage) && s.name.include?(tag)}.map(&:ipv4_address)
end


IO.popen("grunt build") do |output|
  output.each do |line|
    puts line
  end
end

servers.each do |server|
  IO.popen("rsync -avuz dist/ #{secrets['deployment_user']}@#{server}:#{secrets['deployment_path']}") do |output|
    output.each do |line|
      puts line
    end
  end
end
