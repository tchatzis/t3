t3.Timer = function()
{
    this.start = new Date();
    this.running = false;

    this.reset = function()
    {
        this.last = new Date();
        this.elapsed = 0;
        this.ms = 0;
    };

    this.stop = function()
    {
        this.running = false;
    };

    this.update = function()
    {
        this.current = new Date();
        this.interval = this.current - this.last;
        this.ms += this.interval;
        this.elapsed = this.ms / 1000;
        this.fps = 1000 / this.interval;
        this.last = this.current;
    };

    this.reset();
};